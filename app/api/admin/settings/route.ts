import { NextRequest, NextResponse } from 'next/server';
import Admin from '../../model/admin';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';

// GET handler to retrieve admin settings (excluding password)
export async function GET() {
  try {
       await connectDB();
    
    // Find the admin user (typically there's only one)
    const admin = await Admin.findOne({}).select('-password');
    
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
  try {
    await connectDB();
    
    const data = await request.json();
    const { username, email, currentPassword, newPassword } = data;
    
    // Find the admin user
    const admin = await Admin.findOne({});
    
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
    
    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
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
    if (username) admin.username = username;
    if (email) admin.email = email;
    
    // Save changes
    await admin.save();
    
    // If username was changed, update the JWT token
    if (username && username !== admin.username) {
      const token = jwt.sign(
        { username: username, id: admin._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Create response with updated token
      const response = NextResponse.json({ 
        message: 'Admin settings updated successfully',
        admin: { username: admin.username, email: admin.email }
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
      admin: { username: admin.username, email: admin.email }
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
    
    const data = await request.json();
    const { username, password, email } = data;
    
    // Validate required fields
    if (!username || !password || !email) {
      return NextResponse.json({ message: 'Username, password, and email are required' }, { status: 400 });
    }
    
    // Create new admin
    const newAdmin = new Admin({ username, password, email });
    await newAdmin.save();
    
    return NextResponse.json({ 
      message: 'Admin created successfully',
      admin: { username: newAdmin.username, email: newAdmin.email }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ message: 'Failed to create admin' }, { status: 500 });
  }
}
