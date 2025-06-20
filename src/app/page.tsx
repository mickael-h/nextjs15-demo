import React from 'react';
import StoryListClientWrapper from '@/components/StoryListClientWrapper';

export default function Home() {
  return (
    <main className="min-h-screen w-full py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Top Hacker News Stories</h1>
        <StoryListClientWrapper />
      </div>
    </main>
  );
}
