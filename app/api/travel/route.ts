import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateTravelForm, getTravelFormByUser } from '@/lib/db';
import type { TravelForm } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      travel_plan,
      coming_from_which_state,
      return_to_which_state,
      arrival_date,
      arrival_time,
      departure_date,
      departure_time,
      train_no,
      flight_no,
    } = body;

    // Validate required fields
    if (!travel_plan || !coming_from_which_state || !return_to_which_state || !arrival_date || !departure_date) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID from session/auth
    const userId = body.user_id || 'test-user-id';

    const travelForm: Omit<TravelForm, 'travel_id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      travel_plan,
      coming_from_which_state,
      return_to_which_state,
      arrival_date,
      arrival_time: arrival_time || undefined,
      departure_date,
      departure_time: departure_time || undefined,
      train_no: train_no || undefined,
      flight_no: flight_no || undefined,
    };

    const result = await createOrUpdateTravelForm(travelForm);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating travel form:', error);
    return NextResponse.json(
      { message: 'Failed to submit travel form' },
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

    const travelForm = await getTravelFormByUser(userId);

    return NextResponse.json(travelForm, { status: 200 });
  } catch (error) {
    console.error('Error fetching travel form:', error);
    return NextResponse.json(
      { message: 'Failed to fetch travel form' },
      { status: 500 }
    );
  }
}
