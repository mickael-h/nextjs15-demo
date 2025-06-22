import { fetchUser, fetchPagedTopStories, fetchDirectComments } from './hn';

describe('fetchPagedTopStories', () => {
  const hnApiUrl = 'https://mock-hn-api/';

  it('returns correct stories and pagination metadata for page 1 (default top 20)', async () => {
    const ids = Array.from({ length: 30 }, (_, i) => i + 1);
    const mockFetch = jest
      .fn()
      // First call: topstories
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ids),
      })
      // Next 20 calls: each story for page 1
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

    const { stories, page, limit, total, totalPages } = await fetchPagedTopStories(
      mockFetch as unknown as typeof fetch,
      hnApiUrl,
      1,
      20,
    );
    expect(stories).toHaveLength(20);
    expect(page).toBe(1);
    expect(limit).toBe(20);
    expect(total).toBe(30);
    expect(totalPages).toBe(2);
    expect(stories[0].title).toBe('Story 1');
    expect(stories[19].title).toBe('Story 20');
  });

  it('returns correct stories for page 3 (last page, partial)', async () => {
    const ids = Array.from({ length: 45 }, (_, i) => i + 1); // 45 stories
    const mockFetch = jest
      .fn()
      // First call: topstories
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ids),
      })
      // Next 5 calls: each story for page 3
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

    const { stories, page, limit, total, totalPages } = await fetchPagedTopStories(
      mockFetch as unknown as typeof fetch,
      hnApiUrl,
      3,
      20,
    );
    expect(stories).toHaveLength(5);
    expect(page).toBe(3);
    expect(limit).toBe(20);
    expect(total).toBe(45);
    expect(totalPages).toBe(3);
    expect(stories[0].id).toBe(41);
    expect(stories[4].id).toBe(45);
  });

  it('returns empty stories array if page is out of range', async () => {
    const ids = Array.from({ length: 10 }, (_, i) => i + 1); // 10 stories
    const mockFetch = jest
      .fn()
      // First call: topstories
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ids),
      });
    const { stories, page, limit, total, totalPages } = await fetchPagedTopStories(
      mockFetch as unknown as typeof fetch,
      hnApiUrl,
      2,
      20,
    );
    expect(stories).toHaveLength(0);
    expect(page).toBe(2);
    expect(limit).toBe(20);
    expect(total).toBe(10);
    expect(totalPages).toBe(1);
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

describe('fetchDirectComments', () => {
  const hnApiUrl = 'https://mock-hn-api/';

  it('returns empty array for empty input', async () => {
    const mockFetch = jest.fn();
    const comments = await fetchDirectComments(mockFetch as unknown as typeof fetch, hnApiUrl, []);
    expect(comments).toEqual([]);
  });

  it('returns only valid comments (filters out deleted/dead)', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            by: 'user1',
            text: 'Valid comment',
            time: 1600000000,
            kids: [2],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            by: 'user2',
            text: 'Deleted comment',
            time: 1600000001,
            deleted: true,
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 3,
            by: 'user3',
            text: 'Dead comment',
            time: 1600000002,
            dead: true,
          }),
      });
    const comments = await fetchDirectComments(
      mockFetch as unknown as typeof fetch,
      hnApiUrl,
      [1, 2, 3],
    );
    expect(comments).toHaveLength(1);
    expect(comments[0].id).toBe(1);
    expect(comments[0].kids).toEqual([2]);
  });

  it('returns correct structure for valid comments', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          by: 'user1',
          text: 'Test comment',
          time: 1600000000,
          kids: [2, 3],
        }),
    });
    const comments = await fetchDirectComments(mockFetch as unknown as typeof fetch, hnApiUrl, [1]);
    expect(comments).toHaveLength(1);
    expect(comments[0]).toEqual({
      id: 1,
      by: 'user1',
      text: 'Test comment',
      time: 1600000000,
      kids: [2, 3],
    });
  });

  it('handles fetch errors gracefully', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({ ok: false });
    const comments = await fetchDirectComments(mockFetch as unknown as typeof fetch, hnApiUrl, [1]);
    expect(comments).toEqual([]);
  });

  it('can build a multi-level nested comment tree by sequentially fetching each level', async () => {
    // Mock fetch for 3 levels: 1 -> 2 -> 3
    const mockFetch = jest
      .fn()
      // Level 1
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            by: 'user1',
            text: 'Root comment',
            time: 1600000000,
            kids: [2],
          }),
      })
      // Level 2
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            by: 'user2',
            text: 'Child comment',
            time: 1600000001,
            kids: [3],
          }),
      })
      // Level 3
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 3,
            by: 'user3',
            text: 'Grandchild comment',
            time: 1600000002,
            kids: [],
          }),
      });

    // Fetch root
    const rootComments = await fetchDirectComments(mockFetch as unknown as typeof fetch, hnApiUrl, [
      1,
    ]);
    expect(rootComments).toHaveLength(1);
    expect(rootComments[0].id).toBe(1);
    expect(rootComments[0].kids).toEqual([2]);

    // Fetch level 2
    const childComments = await fetchDirectComments(
      mockFetch as unknown as typeof fetch,
      hnApiUrl,
      [2],
    );
    expect(childComments).toHaveLength(1);
    expect(childComments[0].id).toBe(2);
    expect(childComments[0].kids).toEqual([3]);

    // Fetch level 3
    const grandchildComments = await fetchDirectComments(
      mockFetch as unknown as typeof fetch,
      hnApiUrl,
      [3],
    );
    expect(grandchildComments).toHaveLength(1);
    expect(grandchildComments[0].id).toBe(3);
    expect(grandchildComments[0].kids).toEqual([]);
  });
});
