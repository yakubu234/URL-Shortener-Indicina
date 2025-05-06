import redis from '../configs/redis';
import Url from '../models/Url';

export const flushVisitCounts = async () => {
  const keys = await redis.keys('visitCount:*');

  for (const key of keys) {
    const shortCode = key.split(':')[1];
    const count = parseInt((await redis.get(key)) || '0', 10);
    const lastVisitedAt = await redis.get(`lastVisitedAt:${shortCode}`);

    await Url.findOneAndUpdate(
      { shortCode },
      {
        $inc: { visitCount: count },
        $set: { lastVisitedAt: new Date(lastVisitedAt || new Date()) }
      }
    );

    await redis.del(key);
    await redis.del(`lastVisitedAt:${shortCode}`);
  }
};
