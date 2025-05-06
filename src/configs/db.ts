import mongoose from 'mongoose';
import config from './config';
import { logger } from '../utils/logger';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
