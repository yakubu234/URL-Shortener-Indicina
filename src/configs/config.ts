import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  allowedOrigins: string[];
  allowedMethods: string;
  redisUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/myapp',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'],
  allowedMethods: process.env.ALLOWED_METHODS ?? 'GET,POST,PUT,DELETE,OPTIONS',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379'
};

export default config;
