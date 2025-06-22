import useSWR from 'swr';
import { HNComment } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useNestedComments(commentIds: number[] | undefined, maxDepth: number = 5) {
  const { data, error, isLoading, isValidating } = useSWR<{ comments: HNComment[] }>(
    commentIds && commentIds.length > 0
      ? `${BASE_URL}/api/hn/comments/nested?ids=${commentIds.join(',')}&maxDepth=${maxDepth}`
      : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    },
  );

  return {
    comments: data?.comments || [],
    loading: isLoading || isValidating,
    error: error?.message || null,
  };
}
