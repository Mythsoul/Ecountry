import { NextResponse } from 'next/server';
import { requireAuth } from '@/helpers/auth';
import { prisma } from '@/config/db/db';


export async function GET(request) {
  try {
    // Get authenticated user from JWT verification
    const user = await requireAuth(request);
    
    // Fetch full user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        createdAt: true,
        character: true,
        bank: true
      }
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    
    if (error.message === 'User not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile 
export async function PUT(request) {
  try {
    // Get authenticated user from JWT verification
    const user = await requireAuth(request);

    
    const { username } = await request.json();
    
    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.trim(),
        id: { not: user.id }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { username: username.trim() },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.message === 'User not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
