import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../model/admin";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { username, password } = body;

    // Input validation and sanitization
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Prevent extremely long inputs (potential DoS)
    if (username.length > 100 || password.length > 200) {
      return NextResponse.json(
        { error: "Invalid input length" },
        { status: 400 }
      );
    }

    // Trim username (exact match required - case sensitive)
    const normalizedUsername = username.trim();

    // Find admin by username (case-sensitive exact match)
    const admin = await Admin.findOne({ username: normalizedUsername });
    
    // Security: Always perform password comparison to prevent timing attacks
    // Use a dummy comparison if admin not found
    let isPasswordValid = false;
    if (admin) {
      isPasswordValid = await admin.comparePassword(password);
      // Log for debugging (remove in production)
      if (!isPasswordValid) {
        console.log('Password mismatch for user:', normalizedUsername);
      }
    } else {
      // Perform dummy bcrypt comparison to prevent timing attacks
      // This ensures similar response time whether user exists or not
      const dummyHash = '$2a$10$dummy.hash.to.prevent.timing.attacks';
      await bcrypt.compare(password, dummyHash);
      console.log('Admin not found with username:', normalizedUsername);
    }
    
    // If admin not found or password doesn't match
    if (!admin || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Create JWT token with secure payload
    const token = jwt.sign(
      { 
        username: normalizedUsername, 
        id: admin._id.toString(), 
        role: "admin" 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create response
    const response = NextResponse.json({ success: true, message: "Login successful" });
    
    // Set cookie in the response
    response.cookies.set({
      name: "admin-token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Check if user is authenticated
  const token = (await cookies()).get("admin-token")?.value;
  
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // Verify token
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  // Logout - clear the cookie
  (await
    // Logout - clear the cookie
    cookies()).delete("admin-token");
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}