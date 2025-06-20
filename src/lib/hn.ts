import { HNStory, HNUser } from './types';

export async function fetchPagedTopStories(
  fetchImpl: typeof fetch,
  hnApiUrl: string,
  page: number = 1,
  limit: number = 20,
) {
  const TOP_STORIES_URL = `${hnApiUrl}v0/topstories.json`;
  const ITEM_URL = `${hnApiUrl}v0/item`;
  // Fetch all top story IDs
  const idsRes = await fetchImpl(TOP_STORIES_URL);
  if (!idsRes.ok) {
    throw new Error('Failed to fetch story IDs');
  }
  const ids: number[] = await idsRes.json();

  const total = ids.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageIds = ids.slice(start, end);
  // Fetch only the stories for this page
  const stories = await Promise.all(
    pageIds.map(async (id) => {
      const res = await fetchImpl(`${ITEM_URL}/${id}.json`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.id || !data.title || !data.by || data.deleted) {
        return null;
      }
      return {
        id: data.id,
        title: data.title,
        score: data.score,
        url: data.url,
        by: data.by,
        text: data.text,
      } satisfies HNStory;
    }),
  );
  const filteredStories = stories.filter(Boolean) as HNStory[];
  // Sort the page by score descending
  filteredStories.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return { stories: filteredStories, page, limit, total, totalPages };
}

export async function fetchUser(
  fetchImpl: typeof fetch,
  hnApiUrl: string,
  username: string,
): Promise<HNUser> {
  try {
    const url = `${hnApiUrl}v0/user/${username}.json`;
    const res = await fetchImpl(url);
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    return res.json() as Promise<HNUser>;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unknown error');
  }
}
