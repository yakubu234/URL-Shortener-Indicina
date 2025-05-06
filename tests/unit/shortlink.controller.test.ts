import { encodeURL } from '../../src/controllers/shortlink.controller';
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

describe('ShortLink Controller', () => {
  const baseUrl = 'http://localhost.test/';
  const req: any = {};
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a short URL from the service', async () => {
    req.body = { longUrl: 'https://example.com' };
    req.protocol = 'http';
    req.get = jest.fn().mockReturnValue('localhost.test');

    // Mock the service
    (urlService.encode as jest.Mock).mockResolvedValue('http://short.est/abc123');

    const next = jest.fn();
    await encodeURL(req, res, next);

    expect(urlService.encode).toHaveBeenCalledWith('https://example.com', 'http://localhost.test/');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ shortUrl: 'http://short.est/abc123' });
  });
});
