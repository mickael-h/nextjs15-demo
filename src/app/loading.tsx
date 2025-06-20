import React from 'react';

const Loading = () => (
  <main className="min-h-screen w-full py-10 px-4 animate-pulse">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border bg-gray-100 dark:bg-neutral-900 shadow flex flex-col gap-3 min-h-[120px]"
          >
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded mt-auto" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-neutral-800 rounded border" />
        ))}
      </div>
    </div>
  </main>
);

export default Loading;
