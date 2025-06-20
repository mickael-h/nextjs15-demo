'use client';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import Loading from '@/app/loading';

const StoryListClient = dynamic(() => import('./StoryListClient'), { ssr: false });

export default function StoryListClientWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <StoryListClient />
    </Suspense>
  );
}
