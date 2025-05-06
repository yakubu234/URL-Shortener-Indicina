import Url from '../models/Url';
import redis from '../configs/redis';
import { URL_FIELDS } from '../constants/url';
import { generateShortCode } from '../utils/generateShortCode';
import { IUrlService } from './interfaces/IUrlService';

export class UrlService implements IUrlService {
  async encode(longUrl: string, baseUrl: string): Promise<string> {
    const existing = await Url.findOne({ [URL_FIELDS.LONG_URL]: longUrl });
    if (existing) {
      await redis.set(existing.shortCode, longUrl);
      return `${baseUrl}${existing.shortCode}`;
    }

    let shortCode = generateShortCode();
    while (await Url.exists({ [URL_FIELDS.SHORT_CODE]: shortCode })) {
      shortCode = generateShortCode();
    }

    await Url.create({
      [URL_FIELDS.LONG_URL]: longUrl,
      [URL_FIELDS.SHORT_CODE]: shortCode
    });

    await redis.set(shortCode, longUrl);
    return `${baseUrl}${shortCode}`;
  }

  async decode(shortCode: string): Promise<string> {
    let longUrl = await redis.get(shortCode);
    if (!longUrl) {
      const record = await Url.findOne({ [URL_FIELDS.SHORT_CODE]: shortCode });
      if (!record) throw { status: 404, message: 'Short URL not found' };
      longUrl = record.longUrl;
      await redis.set(shortCode, longUrl);
    }
    return longUrl;
  }

  async incrementVisit(shortCode: string) {
    await redis.incr(`visitCount:${shortCode}`);
    await redis.set(`lastVisitedAt:${shortCode}`, new Date().toISOString());
  }

  async getStats(shortCode: string) {
    const record = await Url.findOne({ [URL_FIELDS.SHORT_CODE]: shortCode });
    if (!record) throw { status: 404, message: 'Short URL not found' };

    // Fetch live count from Redis
    const redisCount = parseInt((await redis.get(`visitCount:${shortCode}`)) || '0', 10);
    const liveCount = record.visitCount + redisCount;

    // Optional: merge last visited time
    const redisVisited = await redis.get(`lastVisitedAt:${shortCode}`);

    return {
      ...record.toObject(),
      visitCount: liveCount,
      lastVisitedAt: redisVisited || record.lastVisitedAt
    };
  }

  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const results = await Url.find()
      .sort({ [URL_FIELDS.CREATED_AT]: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Url.countDocuments(); // Get total count for pagination info
    const withLiveCounts = await Promise.all(
      results.map(async (url) => {
        const cached = parseInt((await redis.get(`visitCount:${url.shortCode}`)) || '0', 10);
        const redisVisited = await redis.get(`lastVisitedAt:${url.shortCode}`);
        return {
          ...url.toObject(),
          visitCount: url.visitCount + cached,
          lastVisitedAt: redisVisited || url.lastVisitedAt
        };
      })
    );

    return {
      total,
      page,
      limit,
      data: withLiveCounts
    };
  }

  async search(query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex
    const shortCodeRegex = new RegExp(safe, 'i');

    const filter = {
      $or: [
        { $text: { $search: query } }, // full-text search on longUrl
        { shortCode: { $regex: shortCodeRegex } }, // partial match on shortCode
        { longUrl: { $regex: new RegExp(safe, 'i') } } // partial match on longUrl
      ]
    };

    const baseQuery = Url.find(filter, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit);

    const results = await baseQuery.exec();
    const total = await Url.countDocuments(filter);

    const withLiveCounts = await Promise.all(
      results.map(async (url) => {
        const cached = parseInt((await redis.get(`visitCount:${url.shortCode}`)) || '0', 10);
        const redisVisited = await redis.get(`lastVisitedAt:${url.shortCode}`);
        return {
          ...url.toObject(),
          visitCount: url.visitCount + cached,
          lastVisitedAt: redisVisited || url.lastVisitedAt
        };
      })
    );

    return {
      total,
      page,
      limit,
      data: withLiveCounts
    };
  }
}

export const urlService = new UrlService();
