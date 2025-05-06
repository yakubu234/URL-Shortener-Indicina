import { UrlService } from '../../src/services/UrlService';
import Url from '../../src/models/Url';
import redis from '../../src/configs/redis';

jest.mock('../../src/models/Url', () => {
  const m = {
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
    create: jest.fn(),
    find: jest.fn()
  };
  return { __esModule: true, default: m };
});

const mockUrlModel = Url as jest.Mocked<typeof Url>;
afterAll(async () => {
  // Close Redis connection
  await redis.quit();
});

jest.mock('../../src/configs/redis');

const mockRedis = redis as jest.Mocked<typeof redis>;

describe('UrlService (Unit Tests)', () => {
  const service = new UrlService();
  const baseUrl = 'http://localhost.test/';

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(Url, 'findOneAndUpdate').mockResolvedValue({} as any);
    jest.spyOn(Url, 'findOne').mockResolvedValue(null as any);
    jest.spyOn(Url, 'exists').mockResolvedValue({} as any);
    jest.spyOn(Url, 'create').mockResolvedValue({} as any);
    jest.spyOn(Url, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    } as any);
  });

  it('encode: should return existing short URL if longUrl already exists', async () => {
    jest.spyOn(Url, 'findOne').mockResolvedValue({ shortCode: 'abc123' } as any);

    const result = await service.encode('https://example.com', baseUrl);

    expect(Url.findOne).toHaveBeenCalledWith({ longUrl: 'https://example.com' });
    expect(mockRedis.set).toHaveBeenCalledWith('abc123', 'https://example.com');
    expect(result).toBe('http://localhost.test/abc123');
  });

  it('decode: should get long URL from redis', async () => {
    mockRedis.get.mockResolvedValue('https://example.com');

    const result = await service.decode('abc123');

    expect(mockRedis.get).toHaveBeenCalledWith('abc123');
    expect(result).toBe('https://example.com');
  });

  it('decode: should fallback to DB if not in redis', async () => {
    mockRedis.get.mockResolvedValue(null);
    jest.spyOn(Url, 'findOne').mockResolvedValue({ longUrl: 'https://example.com' } as any);

    const result = await service.decode('abc123');

    expect(Url.findOne).toHaveBeenCalledWith({ shortCode: 'abc123' });
    expect(mockRedis.set).toHaveBeenCalledWith('abc123', 'https://example.com');
    expect(result).toBe('https://example.com');
  });

  it('incrementVisit: should increment Redis counter and set lastVisitedAt', async () => {
    const incrMock = mockRedis.incr;
    const setMock = mockRedis.set;

    await service.incrementVisit('abc123');

    expect(incrMock).toHaveBeenCalledWith('visitCount:abc123');
    expect(setMock).toHaveBeenCalledWith(
      'lastVisitedAt:abc123',
      expect.any(String) // ISO timestamp
    );
  });

  it('getStats: should return the URL record', async () => {
    const mockDoc = {
      shortCode: 'abc123',
      longUrl: 'https://example.com',
      visitCount: 3,
      lastVisitedAt: new Date(),
      toObject: () => ({
        shortCode: 'abc123',
        longUrl: 'https://example.com',
        visitCount: 3,
        lastVisitedAt: new Date()
      })
    };

    jest.spyOn(Url, 'findOne').mockResolvedValue(mockDoc as any);

    const result = await service.getStats('abc123');

    expect(Url.findOne).toHaveBeenCalledWith({ shortCode: 'abc123' });
    expect(result.visitCount).toBe(3);
  });

  it('getAll: should return sorted list of URLs', async () => {
    const mockDoc = {
      shortCode: 'abc123',
      visitCount: 10,
      lastVisitedAt: new Date(),
      toObject: () => ({
        shortCode: 'abc123',
        visitCount: 10,
        lastVisitedAt: new Date()
      })
    };

    mockUrlModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockDoc])
        })
      })
    } as any);

    mockUrlModel.countDocuments = jest.fn().mockResolvedValue(1);

    const result = await service.getAll();

    expect(result.data[0].shortCode).toBe('abc123');
  });

  it('search: should return URLs matching the query', async () => {
    const mockDoc = {
      shortCode: 'abc123',
      visitCount: 3,
      lastVisitedAt: new Date(),
      longUrl: 'https://example.com',
      toObject: () => ({
        shortCode: 'abc123',
        visitCount: 3,
        lastVisitedAt: new Date(),
        longUrl: 'https://example.com'
      })
    };

    jest.spyOn(Url, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockDoc])
          })
        })
      })
    } as any);

    mockUrlModel.countDocuments = jest.fn().mockResolvedValue(1);

    const result = await service.search('exam');

    expect(result.data[0].longUrl).toContain('example.com');
  });
});
