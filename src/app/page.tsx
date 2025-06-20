import React from 'react';
import StoryListClientWrapper from '@/components/StoryListClientWrapper';

export default function Home() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Top Hacker News Stories</h1>
      <StoryListClientWrapper />
    </main>
  );
}
