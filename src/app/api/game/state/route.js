import { NextResponse } from 'next/server';
import { verifyToken } from '@/helpers/jwt';
import GameModel from '@/models/GameModel';

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
    const result = await gameModel.getGameState();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      gameState: result.gameState
    });
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
