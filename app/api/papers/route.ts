import { NextRequest, NextResponse } from 'next/server';
import { createPaper, getPapersByUser } from '@/lib/db';
import type { Paper } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paper_title, paper_pages } = body;

    // Validate input
    if (!paper_title || !paper_pages) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID from session/auth (this is a simplified example)
    // In production, you'd extract this from JWT or session
    const userId = body.user_id || 'test-user-id';

    const paper: Omit<Paper, 'paper_id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      paper_title,
      paper_pages: parseInt(paper_pages),
    };

    const newPaper = await createPaper(paper);

    return NextResponse.json(newPaper, { status: 201 });
  } catch (error) {
    console.error('Error creating paper:', error);
    return NextResponse.json(
      { message: 'Failed to create paper' },
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

    const papers = await getPapersByUser(userId);

    return NextResponse.json(papers, { status: 200 });
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}
