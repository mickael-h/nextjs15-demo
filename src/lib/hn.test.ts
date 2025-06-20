import { fetchTopStories, fetchUser } from './hn';

describe('fetchTopStories', () => {
  const hnApiUrl = 'https://mock-hn-api/';

  it('returns top 20 stories on success', async () => {
    const ids = Array.from({ length: 30 }, (_, i) => i + 1);
    const mockFetch = jest
      .fn()
      // First call: topstories
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ids),
      })
      // Next 20 calls: each story
      .mockImplementation((url: string) => {
        const match = url.match(/item\/(\d+)\.json/);
        if (match) {
          const id = Number(match[1]);
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id,
                title: `Story ${id}`,
                score: 100 - id,
                url: `https://story${id}.com`,
                by: `author${id}`,
              }),
          });
        }
        return Promise.resolve({ ok: false });
      });

    const stories = await fetchTopStories(mockFetch as unknown as typeof fetch, hnApiUrl);
    expect(stories).toHaveLength(20);
    expect(stories[0].title).toBe('Story 1');
    expect(stories[19].title).toBe('Story 20');
  });

  it('throws if top stories fetch fails', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({ ok: false });
    await expect(fetchTopStories(mockFetch as unknown as typeof fetch, hnApiUrl)).rejects.toThrow(
      /Failed to fetch story IDs/,
    );
  });

  it('filters out invalid stories', async () => {
    const ids = [1, 2, 3];
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(ids) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // 1: invalid
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            title: 'Story 2',
            score: 10,
            by: 'author2',
          }),
      }) // 2: valid
      .mockResolvedValueOnce({ ok: false }); // 3: fetch fail
    const stories = await fetchTopStories(mockFetch as unknown as typeof fetch, hnApiUrl);
    expect(stories).toHaveLength(1);
    expect(stories[0].id).toBe(2);
  });
});

describe('fetchUser', () => {
  const hnApiUrl = 'https://mock-hn-api/';
  const username = 'author1';

  it('returns user data on success', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: username, karma: 1234, created: 1600000000 }),
    });
    const user = await fetchUser(mockFetch as unknown as typeof fetch, hnApiUrl, username);
    expect(user.id).toBe(username);
    expect(user.karma).toBe(1234);
  });

  it('throws if user fetch fails', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({ ok: false });
    await expect(
      fetchUser(mockFetch as unknown as typeof fetch, hnApiUrl, username),
    ).rejects.toThrow(/Failed to fetch user/);
  });
});
