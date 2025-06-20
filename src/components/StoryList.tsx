'use client';
import React, { useState, useRef } from 'react';
import { StoryCard } from './StoryCard';
import { StoryDetail } from './StoryDetail';
import { HNStory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Pagination } from './Pagination';

interface StoryListProps {
  stories: HNStory[];
  error: string | null;
  page: number;
  totalPages: number;
}

export function StoryList({ stories, error, page, totalPages }: StoryListProps) {
  const [selected, setSelected] = useState<HNStory | null>(null);
  const router = useRouter();
  const scrollRef = useRef<number>(0);

  const handleSelect = (story: HNStory) => {
    scrollRef.current = window.scrollY;
    setSelected(story);
  };

  const handleBack = () => {
    setSelected(null);
    setTimeout(() => {
      window.scrollTo({ top: scrollRef.current, behavior: 'auto' });
    }, 0);
  };

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (selected) return <StoryDetail story={selected} onBack={handleBack} />;
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex flex-col gap-4 max-w-xl">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onClick={() => handleSelect(story)} />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => router.push(`?page=${p}`)}
      />
    </div>
  );
}
