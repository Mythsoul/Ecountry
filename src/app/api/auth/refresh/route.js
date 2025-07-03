import { NextResponse } from "next/server";
import { verifyRefreshToken, generateToken } from "@/helpers/jwt";
import { setCSRFToken } from "@/helpers/csrf";

export async function POST(req) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 }
      );
    }

    try {
      const data = await verifyRefreshToken(refreshToken);
      const newToken = await generateToken({ payload: data });
      const response = NextResponse.json({ success: true });
      
      // Set new access token
      response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
      });
      
      setCSRFToken(response);
      
      return response;
    } catch (error) {
      const response = NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      return response;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
