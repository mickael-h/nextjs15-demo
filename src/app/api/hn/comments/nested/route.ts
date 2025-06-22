import { NextResponse } from 'next/server';
import { fetchDirectComments } from '@/lib/hn';

export const dynamic = 'force-dynamic';

const HN_API_URL = process.env.HN_API_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    if (!idsParam) {
      return NextResponse.json({ comments: [] });
    }
    const commentIds = idsParam
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
    if (!commentIds.length) {
      return NextResponse.json({ comments: [] });
    }
    // Use shared business logic
    const comments = await fetchDirectComments(fetch, HN_API_URL!, commentIds);
    return NextResponse.json({ comments });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
