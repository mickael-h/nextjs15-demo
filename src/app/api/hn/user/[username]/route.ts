import { NextResponse } from 'next/server';
import { fetchUser } from '@/lib/hn';

const HN_API_URL = process.env.HN_API_URL;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  try {
    const data = await fetchUser(fetch, HN_API_URL!, username);
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Failed to fetch user')) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
