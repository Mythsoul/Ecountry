import { NextResponse } from "next/server";
import { prisma } from "@/config/db/db";
import bcrypt from "bcrypt";
import { generateVerificationToken } from "@/helpers/verification";
import { verificationEmailTemplate } from "@/helpers/emailTemplates";
import { sendMail } from "@/helpers/mailer";
import { setCSRFToken } from "@/helpers/csrf";

export async function POST(req) {
  try {
    const bodyText = await req.text();
const params = new URLSearchParams(bodyText);
const email = params.get("email");
const password = params.get("password");
const username = params.get("username");

    if (!email || !password || !username) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        verifyToken,
        verificationTokenExpiry: tokenExpiry,
        isVerified: false
      }
    });
    
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify?token=${verifyToken}`;
    const emailTemplate = verificationEmailTemplate(verifyLink, username);
    await sendMail({
      email,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html
    });
    
    const response = NextResponse.json({ success: true, message: "Signup successful. Please check your email for verification code." });
    
    setCSRFToken(response);
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
