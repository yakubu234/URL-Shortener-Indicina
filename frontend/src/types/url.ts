export interface UrlItem {
  id: string;
  longUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  lastVisitedAt?: string | null;
}

export interface UrlStats {
  longUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  lastVisitedAt?: string | null;
  averageDailyClicks?: number;
  clicksByTime?: Array<{
    date: string;
    clicks: number;
  }>;
}
