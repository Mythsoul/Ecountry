import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { prisma } from "@/config/db/db";

dotenv.config();

class AuthHelper {
  static async checkUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return {
        exists: !!user,
        user: user || null
      };
    } catch (error) {
      throw new Error("Database error checking user");
    }
  }

  static async hashPassword(password) {
    const salt = Number(process.env.SALT_ROUNDS) || 10;
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
export const getUserId = (request) => {
  return request.headers.get('x-user-id');
};
export const getUserEmail = (request) => {
  return request.headers.get('x-user-email');
};

export const getUser = (request) => {
  const userId = getUserId(request);
  const userEmail = getUserEmail(request);
  
  if (!userId || !userEmail) {
    return null;
  }
  
  return {
    id: userId,
    email: userEmail
  };
};
export const verifyAuthToken = async (request) => {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const requireAuth = async (request) => {
  try {
    const user = await verifyAuthToken(request);
    return user;
  } catch (error) {
    throw new Error('User not authenticated');
  }
};

export default AuthHelper;
