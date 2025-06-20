'use client';
import React, { useState } from 'react';
import { StoryCard } from './StoryCard';
import { StoryDetail } from './StoryDetail';
import { HNStory } from '@/lib/types';

export function StoryList({ stories, error }: { stories: HNStory[]; error: string | null }) {
  const [selected, setSelected] = useState<HNStory | null>(null);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }
  if (selected) {
    return <StoryDetail story={selected} onBack={() => setSelected(null)} />;
  }
  return (
    <div className="grid gap-4">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} onClick={() => setSelected(story)} />
      ))}
    </div>
  );
}
