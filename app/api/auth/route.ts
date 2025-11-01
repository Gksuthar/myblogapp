import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Admin from "../model/admin";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

export async function POST(request: NextRequest) {
  try {
   await connectDB();
    const body = await request.json();
    const { username, password } = body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    
    // If admin not found or password doesn't match
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { username, id: admin._id, role: "admin" },
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