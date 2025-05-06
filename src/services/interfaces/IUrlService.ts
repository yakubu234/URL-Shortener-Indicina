export interface IUrlService {
  encode(longUrl: string, baseUrl: string): Promise<string>;
  decode(shortCode: string): Promise<string>;
  incrementVisit(shortCode: string): Promise<void>;
  getStats(shortCode: string): Promise<any>;
  getAll(page: string | number, limit: string | number): Promise<any[]>;
  search(query: string, page: string | number, limit: string | number): Promise<any[]>;
}
