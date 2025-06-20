import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuthor } from '../hooks/useAuthor';

function TestComponent({ username }: { username: string | null }) {
  const { author, loading, error } = useAuthor(username);
  return (
    <div>
      {loading && <span>Loading...</span>}
      {error && <span>Error: {error}</span>}
      {author && (
        <span>
          {author.id} - {author.karma} - {author.created}
        </span>
      )}
    </div>
  );
}

describe('useAuthor', () => {
  const OLD_FETCH = global.fetch;
  const username = 'testuser';
  const userData = { id: username, karma: 42, created: 1600000000 };

  afterEach(() => {
    global.fetch = OLD_FETCH;
    jest.clearAllMocks();
  });

  it('shows loading then author data on success', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(userData),
    });
    render(<TestComponent username={username} />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(`${username} - 42 - 1600000000`)).toBeInTheDocument();
    });
  });

  it('shows error on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('fail'));
    render(<TestComponent username={username} />);
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to load author details/)).toBeInTheDocument();
    });
  });

  it('returns null author if username is null', () => {
    render(<TestComponent username={null} />);
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error/)).not.toBeInTheDocument();
  });
});
