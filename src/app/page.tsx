import React from 'react';
import { StoryList } from '@/components/StoryList';
import { HNStory } from '@/lib/types';

const getTopStories = async (): Promise<HNStory[]> => {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
  const url = `${BASE_URL}/api/hn/top20`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
};

export default async function Home() {
  let stories: HNStory[] = [];
  let error: string | null = null;
  try {
    stories = await getTopStories();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Top Hacker News Stories</h1>
      <StoryList stories={stories} error={error} />
    </main>
  );
}
