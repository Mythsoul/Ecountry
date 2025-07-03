import { NextResponse } from "next/server";
import { prisma } from "@/config/db/db";
import { generateResetToken } from "@/helpers/verification";
import { passwordResetEmailTemplate } from "@/helpers/emailTemplates";
import { sendMail } from "@/helpers/mailer";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, resetCode, newPassword } = await req.json();
    
    if (email && !resetCode && !newPassword) {
      const verifyCode = generateResetToken();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      await prisma.user.update({
        where: { email },
        data: {
          resetCode: verifyCode,
          resetCodeExpiry: new Date(Date.now() + 60 * 60 * 1000)
        }
      });
      const emailTemplate = passwordResetEmailTemplate(verifyCode, user.username);
      await sendMail({
        email,
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html
      });
      return NextResponse.json({ success: true, message: "Reset code sent successfully" });
    }
    // If reset code and new password are provided, reset password
    if (email && resetCode && newPassword) {
      const user = await prisma.user.findFirst({
        where: {
          email,
          resetCode,
          resetCodeExpiry: { gt: new Date() }
        }
      });
      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid or expired reset code" }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          resetCode: null,
          resetCodeExpiry: null
        }
      });
      return NextResponse.json({ success: true, message: "Password reset successfully" });
    }
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
