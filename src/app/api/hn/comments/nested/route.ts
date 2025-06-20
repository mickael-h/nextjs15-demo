import { NextResponse } from 'next/server';
import { HNComment } from '@/lib/types';

export const dynamic = 'force-dynamic';

const HN_API_URL = process.env.HN_API_URL;

async function fetchNestedComments(
  commentIds: number[],
  maxDepth: number = 5,
  currentDepth: number = 0,
): Promise<HNComment[]> {
  if (currentDepth >= maxDepth || commentIds.length === 0) return [];

  const ITEM_URL = `${HN_API_URL}v0/item`;

  const fetchComment = async (id: number): Promise<HNComment | null> => {
    try {
      const res = await fetch(`${ITEM_URL}/${id}.json`);
      if (!res.ok) return null;

      const data = await res.json();
      if (!data || data.deleted || data.dead) return null;

      // Recursively fetch nested comments if we haven't reached max depth
      let nestedComments: HNComment[] = [];
      if (data.kids && data.kids.length > 0 && currentDepth < maxDepth - 1) {
        nestedComments = await fetchNestedComments(data.kids, maxDepth, currentDepth + 1);
      }

      return {
        id: data.id,
        by: data.by,
        text: data.text,
        time: data.time,
        kids: nestedComments.length > 0 ? nestedComments : undefined,
      };
    } catch {
      return null;
    }
  };

  const comments = await Promise.all(commentIds.map((id) => fetchComment(id)));

  return comments.filter(Boolean) as HNComment[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    const maxDepth = parseInt(searchParams.get('maxDepth') || '3', 10);

    if (!idsParam) {
      return NextResponse.json({ comments: [] });
    }

    const commentIds = idsParam
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    if (commentIds.length === 0) {
      return NextResponse.json({ comments: [] });
    }

    // Fetch the nested comments recursively
    const comments = await fetchNestedComments(commentIds, maxDepth);

    return NextResponse.json({ comments });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
