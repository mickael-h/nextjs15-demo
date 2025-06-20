'use client';
import React, { useState } from 'react';
import { HNComment } from '@/lib/types';
import DOMPurify from 'dompurify';

interface CommentProps {
  comment: HNComment;
  depth?: number;
}

export function Comment({ comment, depth = 0 }: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);

  // Safely sanitize HTML content
  const sanitizedText = comment.text ? DOMPurify.sanitize(comment.text) : '';

  // Format the timestamp
  const formattedTime = new Date(comment.time * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasReplies = comment.kids && comment.kids.length > 0;
  const maxDepth = 5; // Prevent too deep nesting

  return (
    <div
      className={`border-l-2 border-gray-200 dark:border-neutral-700 ${depth > 0 ? 'ml-4' : ''}`}
    >
      <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-r-lg mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-semibold text-gray-800 dark:text-gray-200">{comment.by}</span>
          <span>•</span>
          <span>{formattedTime}</span>
          {hasReplies && (
            <>
              <span>•</span>
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-600 hover:underline text-xs"
              >
                {showReplies ? 'hide replies' : `show ${comment.kids?.length} replies`}
              </button>
            </>
          )}
        </div>

        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedText }}
        />
      </div>

      {hasReplies && showReplies && depth < maxDepth && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500 dark:text-gray-400 italic pl-3">
            {comment.kids?.length} replies available (nested comments coming soon)
          </div>
        </div>
      )}
    </div>
  );
}
