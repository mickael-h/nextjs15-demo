import React from 'react';

export default function Loading() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto pt-0 pb-10 animate-pulse">
      <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border bg-gray-100 dark:bg-neutral-900 shadow flex flex-col gap-2"
          >
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-1/3 bg-gray-100 dark:bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-neutral-800 rounded border" />
        ))}
      </div>
    </main>
  );
}
