import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { useNestedComments } from './useNestedComments';

function TestComponent({ commentIds }: { commentIds: number[] | undefined }) {
  const { comments, loading, error } = useNestedComments(commentIds);
  return (
    <div>
      {loading && <span>Loading...</span>}
      {error && <span>Error: {error}</span>}
      {comments.length > 0 && <span>{comments.map((c) => `${c.id}:${c.text}`).join(',')}</span>}
      {comments.length === 0 && !loading && !error && <span>No comments</span>}
    </div>
  );
}

describe('useNestedComments', () => {
  const OLD_FETCH = global.fetch;
  const commentIds = [1, 2];
  const commentsData = {
    comments: [
      { id: 1, by: 'user1', text: 'Comment 1', time: 1600000000, kids: [] },
      { id: 2, by: 'user2', text: 'Comment 2', time: 1600000001, kids: [] },
    ],
  };

  afterEach(() => {
    global.fetch = OLD_FETCH;
    jest.clearAllMocks();
  });

  function renderWithSWR(ui: React.ReactElement) {
    return render(<SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>);
  }

  it('shows loading then comments on success', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(commentsData),
    });
    renderWithSWR(<TestComponent commentIds={commentIds} />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('1:Comment 1,2:Comment 2')).toBeInTheDocument();
    });
  });

  it('shows error on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('fail'));
    renderWithSWR(<TestComponent commentIds={commentIds} />);
    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });

  it('shows no comments if commentIds is empty', () => {
    renderWithSWR(<TestComponent commentIds={[]} />);
    expect(screen.getByText('No comments')).toBeInTheDocument();
  });

  it('shows no comments if commentIds is undefined', () => {
    renderWithSWR(<TestComponent commentIds={undefined} />);
    expect(screen.getByText('No comments')).toBeInTheDocument();
  });
});
