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
    const result = await gameModel.getBankAccount();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      bankAccount: result.bankAccount
    });
  } catch (error) {
    console.error('Error fetching bank account:', error);
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

    const { amount, operation } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (operation && !['add', 'subtract'].includes(operation)) {
      return NextResponse.json({ error: 'Operation must be "add" or "subtract"' }, { status: 400 });
    }

    const gameModel = new GameModel(decoded.id);
    const result = await gameModel.updateBalance(amount, operation || 'add');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      bankAccount: result.bankAccount
    });
  } catch (error) {
    console.error('Error updating bank balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
