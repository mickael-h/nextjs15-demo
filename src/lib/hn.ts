import { HNStory, HNUser } from './types';

export async function fetchTopStories(
  fetchImpl: typeof fetch,
  hnApiUrl: string,
): Promise<HNStory[]> {
  const TOP_STORIES_URL = `${hnApiUrl}v0/topstories.json`;
  const ITEM_URL = `${hnApiUrl}v0/item`;

  // Fetch top story IDs
  const idsRes = await fetchImpl(TOP_STORIES_URL);
  if (!idsRes.ok) {
    throw new Error('Failed to fetch story IDs');
  }
  const ids: number[] = await idsRes.json();
  const top20 = ids.slice(0, 20);

  // Fetch story details in parallel
  const stories = await Promise.all(
    top20.map(async (id) => {
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
  filteredStories.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return filteredStories;
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
