import { NextResponse } from 'next/server';
import { fetchPagedTopStories } from '@/lib/hn';

export const dynamic = 'force-dynamic';

const HN_API_URL = process.env.HN_API_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const result = await fetchPagedTopStories(fetch, HN_API_URL!, page, limit);
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Failed to fetch story IDs')) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
