import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { prisma } from "@/config/db/db";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

// Hash refresh token for storage using CryptoJS
const hashToken = (token) => {
  return CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
};

export const generateToken = async ({ payload }) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = async ({ payload, oldToken = null }) => {
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
  const hashedToken = hashToken(refreshToken);


  if (oldToken) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(oldToken) },
      data: { revoked: true }
    });
  }

  await prisma.refreshToken.create({
    data: {
      userId: payload.id,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      revoked: false
    }
  });

  return refreshToken;
};

export const verifyToken = async (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = async (token) => {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  const hashed = hashToken(token);
  const dbToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash: hashed,
      revoked: false,
      expiresAt: { gt: new Date() }
    }
  });
  if (!dbToken) throw new Error("Refresh token invalid or expired");
  return decoded;
};

export const revokeAllUserTokens = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true }
  });
};