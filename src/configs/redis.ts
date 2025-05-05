import Redis from 'ioredis';
import config from './config';

const redis = new Redis(config.redisUrl);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

export default redis;
