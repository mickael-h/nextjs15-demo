'use client';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import Loading from '@/app/loading';

const StoryListClient = dynamic(() => import('./StoryListClient'), { ssr: false });

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: unknown) {
    // Log error and info for debugging
    console.error('ErrorBoundary caught an error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p>We couldn&apos;t load the stories. Please try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function StoryListClientWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <StoryListClient />
      </Suspense>
    </ErrorBoundary>
  );
}
