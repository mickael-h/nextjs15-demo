import { NextResponse } from 'next/server';
import { fetchLinkPreview } from '@/lib/preview';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }
  try {
    const metadata = await fetchLinkPreview(url);
    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch or parse metadata' }, { status: 500 });
  }
}

export async function POST() {
  try {
    // ... existing code ...
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch preview' }), { status: 500 });
  }
}
