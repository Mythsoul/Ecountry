import { NextResponse } from "next/server";
import { verifyToken } from "@/helpers/jwt";
import { prisma } from "@/config/db/db";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (token) {
      try {
        const decoded = await verifyToken(token);
        // Revoke all refresh tokens for the user
        await prisma.refreshToken.updateMany({
          where: { userId: decoded.id },
          data: { revoked: true }
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    const response = NextResponse.json({ success: true });
    
    // Clear all authentication-related cookies
    response.cookies.delete("token");
    response.cookies.delete("refreshToken");
    response.cookies.delete("csrf-token");
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
