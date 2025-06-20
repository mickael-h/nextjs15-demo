'use client';
import React from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { StoryList } from './StoryList';
import { PaginatedStories } from '@/lib/types';
import Loading from '@/app/loading';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StoryListClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const { data, error, isLoading, isValidating } = useSWR<PaginatedStories>(
    `/api/hn/top20?page=${page}`,
    fetcher,
    { suspense: false, revalidateOnFocus: false },
  );

  if (isLoading || isValidating) {
    return <Loading />;
  }
  if (error) {
    return <StoryList stories={[]} error={error.message} page={page} totalPages={1} />;
  }
  if (!data) {
    return <StoryList stories={[]} error={null} page={page} totalPages={1} />;
  }
  return (
    <StoryList stories={data.stories} error={null} page={data.page} totalPages={data.totalPages} />
  );
}
