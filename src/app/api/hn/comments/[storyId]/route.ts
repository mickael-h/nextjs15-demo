import { NextResponse } from 'next/server';
import { fetchComments } from '@/lib/hn';

export const dynamic = 'force-dynamic';

const HN_API_URL = process.env.HN_API_URL;

export async function GET(_request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;

    // First, fetch the story to get its comment IDs
    const storyRes = await fetch(`${HN_API_URL}v0/item/${storyId}.json`);
    if (!storyRes.ok) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const story = await storyRes.json();
    if (!story || !story.kids) {
      return NextResponse.json({ comments: [] });
    }

    // Fetch the comments
    const comments = await fetchComments(fetch, HN_API_URL!, story.kids);

    return NextResponse.json({ comments });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
