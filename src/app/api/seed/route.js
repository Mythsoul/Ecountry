import { NextResponse } from 'next/server';
import { prisma } from '@/config/db/db';

export async function POST(request) {
  try {
    // Check if houses already exist
    const existingHouses = await prisma.house.count();
    
    if (existingHouses > 0) {
      return NextResponse.json({ 
        message: 'Houses already exist in database',
        count: existingHouses
      });
    }

    // Sample houses data
    const sampleHouses = [
      {
        location: 'Downtown Villa',
        price: 85000,
        status: 'AVAILABLE'
      },
      {
        location: 'Suburb House',
        price: 45000,
        status: 'AVAILABLE'
      },
      {
        location: 'Countryside Cottage',
        price: 25000,
        status: 'AVAILABLE'
      },
      {
        location: 'Lakeside Mansion',
        price: 120000,
        status: 'AVAILABLE'
      },
      {
        location: 'City Apartment',
        price: 35000,
        status: 'AVAILABLE'
      },
      {
        location: 'Mountain Cabin',
        price: 30000,
        status: 'AVAILABLE'
      }
    ];

    // Create houses
    const createdHouses = await prisma.house.createMany({
      data: sampleHouses
    });

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdHouses.count} houses`,
      houses: sampleHouses
    });
    
  } catch (error) {
    console.error('Error seeding houses:', error);
    return NextResponse.json(
      { error: 'Failed to seed houses' }, 
      { status: 500 }
    );
  }
}
