import { NextResponse } from 'next/server';
import { fetchTopStories } from '@/lib/hn';

export const dynamic = 'force-dynamic';

const HN_API_URL = process.env.HN_API_URL;

export async function GET() {
  try {
    const stories = await fetchTopStories(fetch, HN_API_URL!);
    return NextResponse.json(stories);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Failed to fetch story IDs')) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
