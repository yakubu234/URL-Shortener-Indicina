import { useState, useCallback, useRef } from 'react';
import type { UrlItem } from '@/types/url';
import { toast } from 'sonner';
import { api } from '@/api/client';

function hashData(data: any): string {
  try {
    return JSON.stringify(data); // lightweight hash
  } catch {
    return '';
  }
}

export const useUrlService = () => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasFetched, setHasFetched] = useState(false);

  const previousHash = useRef<string>('');

  const fetchUrls = useCallback(
    async (page = 1, limit = 10) => {
      if (hasFetched) return;

      setLoading(true);
      try {
        const data = await api.fetchUrls(page, limit);

        if (Array.isArray(data.data)) {
          const newHash = hashData(data.data);
          if (newHash !== previousHash.current) {
            setUrls(data.data);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(page);
            previousHash.current = newHash;
            setHasFetched(true);
          }
        } else {
          setUrls([]);
        }
      } catch (error) {
        console.error('Error fetching URLs:', error);
        toast.error('Failed to load URLs');
      } finally {
        setLoading(false);
      }
    },
    [hasFetched]
  );

  const shortenUrl = async (longUrl: string) => {
    try {
      const result = await api.shortenUrl(longUrl);
      setHasFetched(false); // allow refetch
      return result;
    } catch (error) {
      console.error('Error shortening URL:', error);
      throw error;
    }
  };

  const searchUrls = async (query: string) => {
    if (query.length < 3) return;

    setLoading(true);
    try {
      const data = await api.fetchUrls(1, 10, query);

      if (Array.isArray(data.data) && data.data.length > 0) {
        setUrls(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        setUrls([]);
        toast.error('No results found for your search.');
      }
    } catch (error) {
      console.error('Error searching URLs:', error);
      toast.error('Failed to search URLs');
    } finally {
      setLoading(false);
    }
  };

  return {
    urls,
    loading,
    fetchUrls,
    shortenUrl,
    searchUrls,
    totalPages,
    currentPage,
    setCurrentPage
  };
};
