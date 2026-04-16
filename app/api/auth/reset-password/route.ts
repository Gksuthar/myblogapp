import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/api/model/admin";
import crypto from "crypto";
import nodemailer from 'nodemailer';
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  namespace: 'forgot-password',
});

const resetPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  namespace: 'reset-password',
});

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function sendResetEmail(toEmail: string, resetUrl: string) {
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : (process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465);
  const secure = typeof process.env.SMTP_SECURE !== 'undefined'
    ? (process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1')
    : (typeof process.env.MAIL_SECURE !== 'undefined'
      ? (process.env.MAIL_SECURE === 'true' || process.env.MAIL_SECURE === '1')
      : port === 465);

  if (!user || !pass) {
    throw new Error('SMTP credentials are not configured');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: `"Password Reset" <${user}>`,
    to: toEmail,
    subject: 'Reset your password',
    text: `Use this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`,
  });
}

// POST - Forgot password (generate reset token)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const limit = forgotPasswordLimiter.consume(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many reset requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSeconds) },
        }
      );
    }

    await connectDB();
    const { username } = await request.json();
    const successResponse = {
      success: true,
      message: "If the username exists, a reset link has been sent.",
    };

    // Validate input
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Find admin by username
    const admin = await Admin.findOne({ username: username.trim() });

    // Security: Don't reveal if user exists or not
    if (!admin) {
      return NextResponse.json(successResponse);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = hashResetToken(resetToken);
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

    // Save reset token to admin
    admin.resetToken = resetTokenHash;
    admin.resetExpires = resetExpires;
    await admin.save();

    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    const destination = admin.email || process.env.SMTP_USER || process.env.MAIL_USER || '';

    if (destination) {
      try {
        await sendResetEmail(destination, resetUrl);
      } catch (mailError) {
        console.error('Forgot password email send error:', mailError);
      }
    } else {
      console.error('Forgot password email skipped: no destination email available');
    }

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}

// PUT - Reset password (with token)
export async function PUT(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const limit = resetPasswordLimiter.consume(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSeconds) },
        }
      );
    }

    await connectDB();
    const body = await request.json();
    const { token, newPassword } = body;

    // Ensure token is provided and trim it
    const trimmedToken = token?.trim();
    if (!trimmedToken || typeof trimmedToken !== 'string' || trimmedToken.length === 0) {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    // Validate new password
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    const tokenHash = hashResetToken(trimmedToken);

    // Find admin with valid reset token
    const admin = await Admin.findOne({
      resetToken: tokenHash,
      resetExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check for at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" },
        { status: 400 }
      );
    }

    // Update password (will be hashed by pre-save hook)
    admin.password = newPassword;
    admin.resetToken = undefined;
    admin.resetExpires = undefined;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
