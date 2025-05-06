import {
  encodeURL,
  decodeURL,
  getStats,
  searchURLs
} from '../../src/controllers/shortlink.controller';
import { urlService } from '../../src/services/UrlService';
jest.mock('../../src/configs/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    quit: jest.fn()
  }
}));
jest.mock('../../src/services/UrlService');

describe('ShortLink Controller (Mocked Service)', () => {
  const baseUrl = 'http://localhost.test/';
  const req: any = {};
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('encodeURL: should return a short URL from the service', async () => {
    req.body = { longUrl: 'https://example.com' };
    req.protocol = 'http';
    req.get = jest.fn().mockReturnValue('localhost.test');

    (urlService.encode as jest.Mock).mockResolvedValue('http://short.est/abc123');
    const next = jest.fn();
    await encodeURL(req, res, next);

    expect(urlService.encode).toHaveBeenCalledWith('https://example.com', 'http://localhost.test/');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ shortUrl: 'http://short.est/abc123' });
  });

  it('decodeURL: should return the original long URL', async () => {
    req.body = { shortUrl: 'abc123' };

    (urlService.decode as jest.Mock).mockResolvedValue('https://example.com');
    const next = jest.fn();
    await decodeURL(req, res, next);

    expect(urlService.decode).toHaveBeenCalledWith('abc123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ longUrl: 'https://example.com' });
  });

  it('getStats: should return statistics for a short URL', async () => {
    req.params = { urlPath: 'abc123' };

    const stats = {
      longUrl: 'https://example.com',
      shortCode: 'abc123',
      visitCount: 5,
      createdAt: '2025-05-05T00:00:00Z',
      lastVisitedAt: '2025-05-05T10:00:00Z'
    };

    (urlService.getStats as jest.Mock).mockResolvedValue(stats);
    const next = jest.fn();
    await getStats(req, res, next);

    expect(urlService.getStats).toHaveBeenCalledWith('abc123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(stats);
  });

  it('searchURLs: should return search results', async () => {
    req.query = { query: 'exam', page: '1', limit: '10' };

    const results = [
      {
        shortCode: 'abc123',
        longUrl: 'https://example.com',
        visitCount: 3,
        createdAt: '2025-05-05T00:00:00Z',
        lastVisitedAt: '2025-05-05T10:00:00Z'
      }
    ];

    (urlService.search as jest.Mock).mockResolvedValue({
      total: results.length,
      page: 1,
      limit: 10,
      data: results
    });

    const next = jest.fn();
    await searchURLs(req, res, next);

    expect(urlService.search).toHaveBeenCalledWith('exam', 1, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      total: results.length,
      page: 1,
      limit: 10,
      data: results
    });
  });

  it('searchURLs: should return 400 if query is less than 3 chars', async () => {
    req.query = { query: 'ab' };
    const res: any = { status: jest.fn(() => res), json: jest.fn() };

    const next = jest.fn();
    await searchURLs(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Query must be at least 3 characters' });
  });
});
