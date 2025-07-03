import { NextResponse } from "next/server";
import { verifyToken } from "@/helpers/jwt";
import { requireAuth } from "@/helpers/auth";

export async function GET(req) {
  try {
    // Use requireAuth which verifies the JWT token from cookies
    const user = await requireAuth(req);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      },
      authenticated: true
    });
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: "Authentication required",
      authenticated: false
    }, { status: 401 });
  }
}

// POST method - verify token from request body (legacy support)
export async function POST(req) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Token is required" 
      }, { status: 400 });
    }

    const decoded = await verifyToken(token);
    
    return NextResponse.json({
      success: true,
      user: decoded,
      authenticated: true
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Invalid token",
      authenticated: false
    }, { status: 401 });
  }
}
