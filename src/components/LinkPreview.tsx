'use client';
import React from 'react';
import useSWR from 'swr';
import { ClientImage } from './ClientImage';

interface LinkPreviewProps {
  url: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LinkPreview({ url }: LinkPreviewProps) {
  const { data, error, isLoading } = useSWR(`/api/preview?url=${encodeURIComponent(url)}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center border rounded-lg animate-pulse bg-white dark:bg-neutral-900">
        <div className="w-40 h-28 bg-gray-200 dark:bg-neutral-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  return (
    <a
      href={data.url || url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center border rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors bg-white dark:bg-neutral-900"
    >
      {data.image ? (
        <div className="w-40 h-28 flex-shrink-0 bg-white border-r overflow-hidden">
          <ClientImage
            src={data.image}
            alt={data.title || 'Preview image'}
            width={160}
            height={112}
            className="block w-full h-full object-cover"
            style={{ display: 'block' }}
          />
        </div>
      ) : (
        <div className="w-40 h-28 bg-gray-200 dark:bg-neutral-700 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-center gap-2 mb-1">
          {data.logo && (
            <ClientImage
              src={data.logo}
              alt="Logo"
              width={20}
              height={20}
              className="block w-5 h-5 object-contain rounded"
            />
          )}
          <span className="font-semibold truncate text-base">{data.title || url}</span>
        </div>
        {data.description && (
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {data.description}
          </div>
        )}
        <div className="text-xs text-gray-400 truncate mt-1">{data.url || url}</div>
      </div>
    </a>
  );
}
