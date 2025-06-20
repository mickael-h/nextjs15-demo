'use client';
import React from 'react';
import { HNStory } from '@/lib/types';
import { useAuthor } from '../hooks/useAuthor';
import { LinkPreview } from './LinkPreview';

export function StoryDetail({ story, onBack }: { story: HNStory; onBack: () => void }) {
  const { author, loading, error } = useAuthor(story.by);
  return (
    <div className="p-6 rounded-lg border bg-white dark:bg-neutral-900 shadow-md max-w-xl mx-auto">
      <button
        className="mb-4 text-sm text-blue-600 hover:underline"
        onClick={onBack}
        aria-label="Back to list"
      >
        ← Back to list
      </button>
      <h2 className="text-xl font-bold mb-2">{story.title}</h2>
      {story.text && (
        <div
          className="prose prose-sm dark:prose-invert mb-2"
          dangerouslySetInnerHTML={{ __html: story.text }}
        />
      )}
      <div className="mb-2">
        {story.url && (
          <div className="mb-2">
            <LinkPreview url={story.url} />
          </div>
        )}
      </div>
      <div className="mb-2">
        Score: <span className="font-mono">{story.score}</span>
      </div>
      <div className="mb-2">
        Author: <span className="font-mono">{story.by}</span>
      </div>
      {loading && <div>Loading author details…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {author && (
        <div className="mt-2 text-sm">
          <div>
            Karma: <span className="font-mono">{author.karma}</span>
          </div>
          <div>Account created: {new Date(author.created * 1000).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
}
