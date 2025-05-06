import Redis, { RedisOptions } from 'ioredis';
import { logger } from '../utils/logger';
import config from './config';

const redisOptions: RedisOptions = {
  host: config.redis.host,
  port: config.redis.port
};

// Only add auth if values are present
if (config.redis.username) {
  redisOptions.username = config.redis.username;
}

if (config.redis.password) {
  redisOptions.password = config.redis.password;
}

const redis = new Redis(redisOptions);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error:', err));

export default redis;
