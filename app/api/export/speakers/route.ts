import { NextRequest, NextResponse } from 'next/server';
import { generateSpeakerReport } from '@/lib/csv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { speakers, eventTitle = 'Event' } = body;

    if (!Array.isArray(speakers)) {
      return NextResponse.json(
        { error: 'Speakers must be an array' },
        { status: 400 }
      );
    }

    const csv = generateSpeakerReport(speakers, eventTitle);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="speakers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export speakers' },
      { status: 500 }
    );
  }
}
