'use client';
import React from 'react';
import { Comment } from './Comment';
import { HNComment } from '@/lib/types';

interface CommentsListProps {
  comments: HNComment[];
  loading: boolean;
  error: string | null;
}

export function CommentsList({ comments, loading, error }: CommentsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-l-2 border-gray-200 dark:border-neutral-700 ml-4">
              <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                  <span>•</span>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          Error loading comments: {error}
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">No comments yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
