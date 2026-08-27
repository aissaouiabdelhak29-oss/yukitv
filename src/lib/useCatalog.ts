import { useEffect, useState } from 'react';
import { Genre, Media } from '../types';
import { getCatalog } from './supabase';

export function useCatalog() {
  const [media, setMedia] = useState<Media[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getCatalog().then(data => {
      if (!alive) return;
      setMedia(data.media); setGenres(data.genres); setError(null);
    }).catch(err => {
      if (!alive) return;
      console.error(err); setError(err instanceof Error ? err.message : 'تعذر الاتصال بقاعدة البيانات');
    }).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return { media, genres, loading, error };
}
