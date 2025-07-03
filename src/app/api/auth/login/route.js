import { NextResponse } from "next/server";
import { prisma } from "@/config/db/db";
import bcrypt from "bcrypt";
import { generateToken, generateRefreshToken } from "@/helpers/jwt";
import { setCSRFToken } from "@/helpers/csrf";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }
    if (!user.isVerified) {
      return NextResponse.json({ success: false, error: "Email not verified" }, { status: 403 });
    }
    const { password: _, ...safeUser } = user;
    const token = await generateToken({ payload: safeUser });
    const refreshToken = await generateRefreshToken({ payload: safeUser });
    const response = NextResponse.json({ success: true, user: safeUser });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
      path: "/"
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    });
    
    setCSRFToken(response);
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
