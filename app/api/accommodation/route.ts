import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateAccommodation, getAccommodationByUser } from '@/lib/db';
import type { AccommodationForm } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostel_needed, hotel_info, food_pref } = body;

    // Get user ID from session/auth
    const userId = body.user_id || 'test-user-id';

    const accommodationForm: Omit<AccommodationForm, 'accommodation_id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      hostel_needed: hostel_needed || false,
      hotel_info: hotel_info || undefined,
      food_pref: food_pref || undefined,
    };

    const result = await createOrUpdateAccommodation(accommodationForm);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating accommodation:', error);
    return NextResponse.json(
      { message: 'Failed to submit accommodation form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { message: 'user_id is required' },
        { status: 400 }
      );
    }

    const accommodation = await getAccommodationByUser(userId);

    return NextResponse.json(accommodation, { status: 200 });
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    return NextResponse.json(
      { message: 'Failed to fetch accommodation' },
      { status: 500 }
    );
  }
}
