import dotenv from "dotenv";
import { prisma } from "@/config/db/db";
import AuthHelper from "@/helpers/auth";
import { generateToken, generateRefreshToken } from "@/helpers/jwt";

dotenv.config();

class AuthModel {
  constructor(formData) {
    this.formData = formData;
    this.email = formData.email;
    this.password = formData.password;
    this.username = formData.username;
  }

  async login() {
    const { email, password } = this.formData;

    if (!email || !password) {
      return { 
        success: false, 
        status: 400, 
        error: "Email and password are required" 
      };
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          error: "User not found" 
        };
      }

      const isValidPassword = await AuthHelper.comparePassword(password, user.password);
      if (!isValidPassword) {
        return { 
          success: false, 
          status: 401, 
          error: "Invalid password" 
        };
      }

      const { password: _, ...safeUser } = user;
      
      // Generate tokens
      const token = await generateToken({ payload: safeUser });
      const refreshToken = await generateRefreshToken({ payload: safeUser });

      // Return success with user data
      return {
        success: true,
        token,
        refreshToken,
        user: safeUser
      };
    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        status: 500, 
        error: "Internal server error" 
      };
    }
  }

  async signup() {
    const { email, password, username } = this.formData;

    if (!email || !password || !username) {
      return { 
        success: false, 
        status: 400, 
        error: "Please fill all fields" 
      };
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      
      if (existingUser) {
        return { 
          success: false, 
          status: 400, 
          error: "User already exists" 
        };
      }

      const hashedPassword = await AuthHelper.hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword
        }
      });

      const { password: _, ...safeUser } = user;

      const token = await generateToken({ payload: safeUser });

      return {
        success: true,
        status: 200,
        user: safeUser,
        message: "Signup successful.",
        token
      };
    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        status: 500, 
        error: "Internal server error: " + error.message 
      };
    }
  }
}

export default AuthModel;