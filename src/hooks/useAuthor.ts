import useSWR from 'swr';
import type { HNUser } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAuthor(username: string | null) {
  const { data, error, isLoading, isValidating } = useSWR<HNUser>(
    username ? `${BASE_URL}/api/hn/user/${username}` : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    },
  );

  return {
    author: data ?? null,
    loading: isLoading || isValidating,
    error: error ? 'Failed to load author details' : null,
  };
}
