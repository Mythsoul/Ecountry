import { NextResponse } from 'next/server';
import { verifyToken } from '@/helpers/jwt';
import GameModel from '@/models/GameModel';

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, gender, avatarUrl } = await request.json();

    if (!name || !gender) {
      return NextResponse.json({ error: 'Name and gender are required' }, { status: 400 });
    }

    const gameModel = new GameModel(decoded.id);
    const result = await gameModel.createCharacter({ name, gender, avatarUrl });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      character: result.character,
      message: result.message
    });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const gameModel = new GameModel(decoded.id);
    const result = await gameModel.getCharacter();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      character: result.character
    });
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { x, y } = await request.json();

    if (x === undefined || y === undefined) {
      return NextResponse.json({ error: 'X and Y coordinates are required' }, { status: 400 });
    }

    const gameModel = new GameModel(decoded.id);
    const result = await gameModel.updateCharacterPosition(x, y);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      character: result.character
    });
  } catch (error) {
    console.error('Error updating character position:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
