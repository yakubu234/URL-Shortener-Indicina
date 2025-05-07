export interface UrlItem {
  id: string;
  _id: string;
  longUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  lastVisitedAt?: string | null;
}

export interface UrlStats {
  _id: string;
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
