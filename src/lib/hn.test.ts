import { fetchUser, fetchPagedTopStories, fetchComments } from './hn';

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

describe('fetchComments', () => {
  const hnApiUrl = 'https://mock-hn-api/';

  it('returns empty array when no comment IDs provided', async () => {
    const mockFetch = jest.fn();
    const comments = await fetchComments(mockFetch as unknown as typeof fetch, hnApiUrl, []);
    expect(comments).toEqual([]);
  });

  it('returns comments for valid comment IDs', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            by: 'user1',
            text: 'First comment',
            time: 1600000000,
            kids: [2, 3],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            by: 'user2',
            text: 'Second comment',
            time: 1600000001,
            kids: [],
          }),
      });

    const comments = await fetchComments(mockFetch as unknown as typeof fetch, hnApiUrl, [1, 2]);

    expect(comments).toHaveLength(2);
    expect(comments[0]).toEqual({
      id: 1,
      by: 'user1',
      text: 'First comment',
      time: 1600000000,
      kids: [2, 3],
    });
    expect(comments[1]).toEqual({
      id: 2,
      by: 'user2',
      text: 'Second comment',
      time: 1600000001,
      kids: [],
    });
  });

  it('filters out deleted and dead comments', async () => {
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
            deleted: false,
            dead: false,
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

    const comments = await fetchComments(mockFetch as unknown as typeof fetch, hnApiUrl, [1, 2, 3]);

    expect(comments).toHaveLength(1);
    expect(comments[0].id).toBe(1);
  });

  it('handles fetch errors gracefully', async () => {
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
          }),
      })
      .mockResolvedValueOnce({
        ok: false, // Simulate fetch error
      });

    const comments = await fetchComments(mockFetch as unknown as typeof fetch, hnApiUrl, [1, 2]);

    expect(comments).toHaveLength(1);
    expect(comments[0].id).toBe(1);
  });
});
