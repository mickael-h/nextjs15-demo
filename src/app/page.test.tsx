import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoryList } from '@/components/StoryList';
import { HNStory } from '@/lib/types';
import { useRouter } from 'next/navigation';

// Mock next/navigation hooks for App Router context
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => ({ get: () => null }),
}));

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ id: 'author1', karma: 123, created: 1600000000 }),
});

const mockStories: HNStory[] = [
  {
    id: 1,
    title: 'Test Story',
    score: 100,
    url: 'https://example.com',
    by: 'author1',
  },
];

describe('StoryList component', () => {
  beforeEach(() => {
    document.body.style.background = '';
    document.body.style.color = '';
    jest.clearAllMocks();
  });

  it('renders the heading and stories', async () => {
    render(<StoryList stories={mockStories} error={null} page={1} totalPages={1} />);
    expect(screen.getByText('Test Story')).toBeInTheDocument();
    expect(screen.getByText(/by\s+author1\s+•\s+Score:\s+100/)).toBeInTheDocument();
  });

  it('shows error message on error', () => {
    render(<StoryList stories={[]} error="Something went wrong" page={1} totalPages={1} />);
    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  it('applies light mode background and text color', () => {
    document.documentElement.style.setProperty('--background', '#ffffff');
    document.documentElement.style.setProperty('--foreground', '#171717');
    document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue(
      '--background',
    );
    document.body.style.color = getComputedStyle(document.documentElement).getPropertyValue(
      '--foreground',
    );
    expect(document.body.style.background).toBe('rgb(255, 255, 255)');
    expect(document.body.style.color).toBe('rgb(23, 23, 23)');
  });

  it('applies dark mode background and text color', () => {
    document.documentElement.style.setProperty('--background', '#0a0a0a');
    document.documentElement.style.setProperty('--foreground', '#ededed');
    document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue(
      '--background',
    );
    document.body.style.color = getComputedStyle(document.documentElement).getPropertyValue(
      '--foreground',
    );
    expect(document.body.style.background).toBe('rgb(10, 10, 10)');
    expect(document.body.style.color).toBe('rgb(237, 237, 237)');
  });

  it('allows clicking a story to view its details and back to list', async () => {
    render(<StoryList stories={mockStories} error={null} page={1} totalPages={1} />);
    const user = userEvent.setup();
    const storyButton = screen.getByRole('button', {
      name: /view details for test story/i,
    });
    await user.click(storyButton);
    // Detail view should show
    expect(screen.getByRole('heading', { name: /test story/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to list/i })).toBeInTheDocument();
    expect(screen.getByText('Author:')).toBeInTheDocument();
    expect(screen.getByText('author1')).toBeInTheDocument();
    expect(screen.getByText('Karma:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText(/account created:/i)).toBeInTheDocument();
    expect(screen.getByText(/9\/13\/2020/)).toBeInTheDocument();
    // Go back
    await user.click(screen.getByRole('button', { name: /back to list/i }));
    expect(screen.getByText('Test Story')).toBeInTheDocument();
  });

  describe('Pagination logic', () => {
    const allStories = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      title: `Story ${i + 1}`,
      score: 100 - i,
      by: `author${i + 1}`,
    }));
    const pageSize = 20;
    const totalPages = 3;

    it('disables Previous on first page and Next on last page', () => {
      const { rerender } = render(
        <StoryList
          stories={allStories.slice(0, pageSize)}
          error={null}
          page={1}
          totalPages={totalPages}
        />,
      );
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();

      rerender(
        <StoryList
          stories={allStories.slice(40, 60)}
          error={null}
          page={3}
          totalPages={totalPages}
        />,
      );
      expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /previous page/i })).not.toBeDisabled();
    });

    it('disables the active page button', () => {
      render(
        <StoryList
          stories={allStories.slice(20, 40)}
          error={null}
          page={2}
          totalPages={totalPages}
        />,
      );
      const page2 = screen.getByRole('button', { name: '2' });
      expect(page2).toBeDisabled();
    });

    it('updates the URL with the correct page parameter when a page button is clicked', async () => {
      const push = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push });
      render(
        <StoryList
          stories={allStories.slice(0, pageSize)}
          error={null}
          page={1}
          totalPages={totalPages}
        />,
      );
      const page2 = screen.getByRole('button', { name: '2' });
      await userEvent.click(page2);
      expect(push).toHaveBeenCalledWith('?page=2');
    });
  });
});
