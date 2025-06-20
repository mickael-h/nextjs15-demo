'use client';
import React from 'react';
import { HNStory } from '@/lib/types';
import { useAuthor } from '../hooks/useAuthor';
import { useComments } from '../hooks/useComments';
import { LinkPreview } from './LinkPreview';
import { CommentsList } from './CommentsList';
import DOMPurify from 'dompurify';

export function StoryDetail({ story, onBack }: { story: HNStory; onBack: () => void }) {
  const { author, loading, error } = useAuthor(story.by);
  const { comments, loading: commentsLoading, error: commentsError } = useComments(story.id);

  // Safely sanitize HTML content if present
  const sanitizedText = story.text ? DOMPurify.sanitize(story.text) : null;

  return (
    <div className="p-6 rounded-lg border bg-white dark:bg-neutral-900 shadow-md max-w-7xl mx-auto w-full">
      <button
        className="mb-4 text-sm text-blue-600 hover:underline"
        onClick={onBack}
        aria-label="Back to list"
      >
        ← Back to list
      </button>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 flex flex-col min-h-0">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6">{story.title}</h2>
            {sanitizedText && (
              <div
                className="prose prose-sm lg:prose-base xl:prose-lg dark:prose-invert mb-6"
                dangerouslySetInnerHTML={{ __html: sanitizedText }}
              />
            )}
          </div>
          {story.url && (
            <div className="mt-auto pt-6">
              <LinkPreview url={story.url} />
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <CommentsList comments={comments} loading={commentsLoading} error={commentsError} />
          </div>
        </div>
        <div className="xl:col-span-1">
          <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg sticky top-4">
            <h3 className="font-semibold mb-4 text-xl">Story Details</h3>
            <div className="space-y-3 text-base">
              <div>
                Score: <span className="font-mono font-semibold text-lg">{story.score}</span>
              </div>
              <div>
                Author: <span className="font-mono font-semibold text-lg">{story.by}</span>
              </div>
              {story.time && (
                <div>
                  Posted:{' '}
                  <span className="text-sm">
                    {new Date(story.time * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
              {story.kids && (
                <div>
                  Comments:{' '}
                  <span className="font-mono font-semibold text-lg">{story.kids.length}</span>
                </div>
              )}
            </div>
            {loading && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <h4 className="font-semibold mb-3 text-lg">Author Info</h4>
                <div className="space-y-2 text-base">
                  <div>
                    Karma:{' '}
                    <span className="font-mono font-semibold text-lg text-transparent bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-16 inline-block">
                      123
                    </span>
                  </div>
                  <div>
                    Account created:{' '}
                    <span className="text-base text-transparent bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-24 inline-block">
                      01/01/2024
                    </span>
                  </div>
                </div>
              </div>
            )}
            {error && <div className="mt-4 text-base text-red-600">{error}</div>}
            {author && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <h4 className="font-semibold mb-3 text-lg">Author Info</h4>
                <div className="space-y-2 text-base">
                  <div>
                    Karma: <span className="font-mono font-semibold text-lg">{author.karma}</span>
                  </div>
                  <div>Account created: {new Date(author.created * 1000).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
