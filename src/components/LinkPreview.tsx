'use client';
import React from 'react';
import useSWR from 'swr';
import Image from 'next/image';

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  image?: string;
  title?: string;
  description?: string;
  logo?: string;
  url?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LinkPreview({ url }: LinkPreviewProps) {
  const { data, error, isLoading } = useSWR<PreviewData>(
    url ? `/api/preview?url=${encodeURIComponent(url)}` : null,
    fetcher,
  );

  if (isLoading) {
    return (
      <div className="flex border rounded-lg bg-gray-50 dark:bg-neutral-800 animate-pulse overflow-hidden max-w-xl">
        <div className="w-40 h-28 bg-gray-200 dark:bg-neutral-700 flex-shrink-0" />
        <div className="flex-1 p-4 space-y-2">
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 w-1/2 bg-gray-100 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    );
  }
  if (error || !data) {
    return null;
  }
  return (
    <a
      href={data.url || url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex border rounded-lg bg-gray-50 dark:bg-neutral-800 hover:shadow transition overflow-hidden max-w-xl"
      aria-label={data.title || url}
    >
      {data.image ? (
        <Image
          src={data.image}
          alt={data.title || 'Preview image'}
          width={160}
          height={112}
          className="w-40 h-28 object-cover flex-shrink-0 bg-white border-r"
        />
      ) : (
        <div className="w-40 h-28 bg-gray-200 dark:bg-neutral-700 flex-shrink-0" />
      )}
      <div className="flex-1 p-4 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          {data.logo && (
            <Image
              src={data.logo}
              alt="Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded"
            />
          )}
          <span className="font-semibold truncate text-base">{data.title || url}</span>
        </div>
        {data.description && (
          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">
            {data.description}
          </div>
        )}
        <div className="text-xs text-blue-700 truncate mt-auto">{data.url || url}</div>
      </div>
    </a>
  );
}
