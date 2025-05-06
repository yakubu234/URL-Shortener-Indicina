import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`, {
    stack: err.stack,
    status: err.status
  });

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message
  });
};
