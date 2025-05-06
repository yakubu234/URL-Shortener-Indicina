import type { UrlItem, UrlStats } from '@/types/url';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async fetchUrls(
    page = 1,
    limit = 10,
    query = ''
  ): Promise<{
    data: UrlItem[];
    total: number;
    totalPages?: number;
  }> {
    const q = query.length >= 3 ? `&query=${encodeURIComponent(query)}` : '';
    const res = await fetch(`${baseUrl}/list?page=${page}&limit=${limit}${q}`);
    if (!res.ok) throw new Error('Failed to fetch URLs');
    return res.json();
  },

  async shortenUrl(longUrl: string) {
    const res = await fetch(`${baseUrl}/encode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longUrl })
    });
    if (!res.ok) throw new Error('Failed to shorten URL');
    return res.json();
  },

  async getStats(shortCode: string): Promise<UrlStats> {
    const res = await fetch(`${baseUrl}/statistic/${shortCode}`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async decode(shortCode: string): Promise<string> {
    const res = await fetch(`${baseUrl}/decode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortUrl: shortCode })
    });
    if (!res.ok) throw new Error('Failed to decode URL');
    const data = await res.json();
    return data.longUrl;
  }
};
