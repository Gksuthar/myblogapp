import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/api/model/admin";
import crypto from "crypto";

// POST - Forgot password (generate reset token)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { username } = await request.json();

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
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json({
        success: true,
        message: "If the username exists, a reset link has been generated.",
        resetUrl: "", // Don't reveal if user exists
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

    // Save reset token to admin
    admin.resetToken = resetToken;
    admin.resetExpires = resetExpires;
    await admin.save();

    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // In production, you would send an email here instead of returning the URL
    // For now, return the URL (remove this in production and send email instead)
    return NextResponse.json({
      success: true,
      message: "If the username exists, a reset link has been generated.",
      resetUrl: resetUrl, // Remove this in production
    });
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

    // Find admin with valid reset token
    const admin = await Admin.findOne({
      resetToken: trimmedToken,
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
