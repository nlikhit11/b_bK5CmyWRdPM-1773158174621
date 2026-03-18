import { NextRequest, NextResponse } from 'next/server';
import { generateAttendeeReport } from '@/lib/csv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attendees, eventTitle = 'Event' } = body;

    if (!Array.isArray(attendees)) {
      return NextResponse.json(
        { error: 'Attendees must be an array' },
        { status: 400 }
      );
    }

    const csv = generateAttendeeReport(attendees, eventTitle);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="attendees-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export attendees' },
      { status: 500 }
    );
  }
}
