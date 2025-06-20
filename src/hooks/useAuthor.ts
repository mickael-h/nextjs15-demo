import { useState, useEffect } from 'react';
import type { HNUser } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export function useAuthor(username: string | null) {
  const [author, setAuthor] = useState<HNUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setAuthor(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/api/hn/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load author details');
        setLoading(false);
      });
  }, [username]);

  return { author, loading, error };
}
