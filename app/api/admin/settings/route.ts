import { NextRequest, NextResponse } from 'next/server';
import Admin from '../../model/admin';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  return secret && secret.length > 0 ? secret : null;
}

function getAdminToken(req: NextRequest) {
  return req.cookies.get('admin-token')?.value;
}

function requireAdminAuth(req: NextRequest) {
  const token = getAdminToken(req);
  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const secret = getJwtSecret();
  if (!secret) {
    return {
      ok: false as const,
      response: NextResponse.json({ message: 'Server misconfigured' }, { status: 500 }),
    };
  }

  try {
    jwt.verify(token, secret);
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }
}

// GET handler to retrieve admin settings (excluding password)
export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    // Find the admin user (typically there's only one)
    const admin = await Admin.findOne({}).select('-password').lean();

    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ message: 'Failed to fetch admin settings' }, { status: 500 });
  }
}

// PUT handler to update admin settings
export async function PUT(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    const data = await request.json();
    const { username, email, currentPassword, newPassword } = data as Record<string, unknown>;

    // Find the admin user
    const admin = await Admin.findOne({});

    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    const oldUsername = admin.username;

    // Verify current password if changing password
    if (typeof newPassword === 'string' && newPassword.length > 0) {
      if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
        return NextResponse.json({ message: 'Current password is required' }, { status: 400 });
      }

      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
      }

      // Update password
      admin.password = newPassword;
    }

    // Update other fields if provided
    if (typeof username === 'string' && username.trim().length > 0) admin.username = username.trim();
    if (typeof email === 'string' && email.trim().length > 0) admin.email = email.trim();

    // Save changes
    await admin.save();

    // If username was changed, update the JWT token
    if (typeof username === 'string' && username.trim().length > 0 && admin.username !== oldUsername) {
      const secret = getJwtSecret();
      if (!secret) {
        return NextResponse.json(
          {
            message: 'Admin settings updated successfully',
            admin: { username: admin.username, email: admin.email },
          },
          { status: 200 }
        );
      }

      const token = jwt.sign(
        { username: admin.username, id: admin._id.toString(), role: 'admin' },
        secret,
        { expiresIn: '24h' }
      );

      // Create response with updated token
      const response = NextResponse.json({
        message: 'Admin settings updated successfully',
        admin: { username: admin.username, email: admin.email },
      });

      // Set the new token as a cookie
      response.cookies.set({
        name: 'admin-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({
      message: 'Admin settings updated successfully',
      admin: { username: admin.username, email: admin.email },
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ message: 'Failed to update admin settings' }, { status: 500 });
  }
}

// POST handler to create initial admin if none exists
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      return NextResponse.json({ message: 'Admin already exists' }, { status: 400 });
    }

    // Require a one-time setup key in production to prevent first-boot takeover
    if (process.env.NODE_ENV === 'production') {
      const setupKey = process.env.ADMIN_SETUP_KEY;
      const provided = request.headers.get('x-admin-setup-key') || '';
      if (!setupKey || provided !== setupKey) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    const data = await request.json();
    const { username, password, email } = data as Record<string, unknown>;

    // Validate required fields
    if (typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }
    if (typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Create new admin
    const newAdmin = new Admin({ username: username.trim(), password, email: email.trim() });
    await newAdmin.save();

    return NextResponse.json(
      {
        message: 'Admin created successfully',
        admin: { username: newAdmin.username, email: newAdmin.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ message: 'Failed to create admin' }, { status: 500 });
  }
}
