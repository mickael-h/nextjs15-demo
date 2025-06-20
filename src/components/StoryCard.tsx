'use client';
import React from 'react';
import { HNStory } from '@/lib/types';

export function StoryCard({ story, onClick }: { story: HNStory; onClick: () => void }) {
  return (
    <button
      className="text-left p-4 rounded-lg border bg-white dark:bg-neutral-900 shadow hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onClick}
      aria-label={`View details for ${story.title}`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{story.title}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          by {story.by} • Score: {story.score}
        </span>
        {story.url && <span className="text-xs text-blue-700 truncate">{story.url}</span>}
      </div>
    </button>
  );
}
