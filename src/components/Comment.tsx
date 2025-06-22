'use client';
import React, { useState } from 'react';
import { HNComment } from '@/lib/types';
import { useNestedComments } from '../hooks/useNestedComments';
import DOMPurify from 'dompurify';

interface CommentProps {
  comment: HNComment;
  depth?: number;
}

function CommentSkeleton({ depth = 0 }: { depth?: number }) {
  return (
    <div
      className={`border-l-2 border-gray-200 dark:border-neutral-700 ${depth > 0 ? 'ml-4' : ''}`}
    >
      <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-r-lg mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="w-16 h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <span>•</span>
          <div className="w-20 h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function Comment({ comment, depth = 0 }: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);

  // Check if we have reply IDs to fetch (for lazy loading)
  const hasReplyIds =
    Array.isArray(comment.kids) && comment.kids.length > 0 && typeof comment.kids[0] === 'number';

  // Check if we have already-loaded reply objects
  const hasLoadedReplies =
    Array.isArray(comment.kids) && comment.kids.length > 0 && typeof comment.kids[0] === 'object';

  // Only fetch nested comments if we have IDs and user wants to see replies
  const {
    comments: nestedComments,
    loading: nestedLoading,
    error: nestedError,
  } = useNestedComments(hasReplyIds && showReplies ? (comment.kids as number[]) : undefined);

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

  // Calculate reply count from either IDs or loaded objects
  const replyCount = hasReplyIds
    ? (comment.kids as number[]).length
    : hasLoadedReplies
      ? (comment.kids as HNComment[]).length
      : 0;

  const hasReplies = hasReplyIds || hasLoadedReplies;

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
                disabled={nestedLoading}
              >
                {nestedLoading
                  ? 'loading...'
                  : showReplies
                    ? 'hide replies'
                    : `show ${replyCount} replies`}
              </button>
            </>
          )}
        </div>

        <div
          className="prose prose-sm dark:prose-invert max-w-none [&_code]:break-words [&_code]:whitespace-pre-wrap [&_code]:bg-gray-100 [&_code]:dark:bg-neutral-700 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizedText }}
        />
      </div>

      {hasReplies && showReplies && (
        <div className="space-y-2">
          {nestedLoading && (
            <>
              <CommentSkeleton depth={depth + 1} />
              <CommentSkeleton depth={depth + 1} />
            </>
          )}
          {nestedError && (
            <div className="text-sm text-red-600 dark:text-red-400 italic pl-3">
              Failed to load replies: {nestedError}
            </div>
          )}
          {!nestedLoading && !nestedError && (
            <>
              {/* Render already-loaded nested comments */}
              {hasLoadedReplies &&
                (comment.kids as HNComment[]).map((nestedComment) => (
                  <Comment
                    key={`${comment.id}-${nestedComment.id}`}
                    comment={nestedComment}
                    depth={depth + 1}
                  />
                ))}
              {/* Render newly fetched nested comments */}
              {nestedComments.map((nestedComment) => (
                <Comment
                  key={`${comment.id}-${nestedComment.id}`}
                  comment={nestedComment}
                  depth={depth + 1}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
