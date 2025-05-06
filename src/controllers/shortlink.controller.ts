import { urlService } from '../services/UrlService';
import { Request, Response, NextFunction } from 'express';

export const encodeURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const url = `${req.protocol}://${req.get('host')}/`;
    const result = await urlService.encode(req.body.longUrl, url);
    res.status(200).json({ shortUrl: result });
  } catch (err) {
    next(err);
  }
};

export const decodeURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await urlService.decode(req.body.shortUrl);
    res.status(200).json({ longUrl: result });
  } catch (err) {
    next(err);
  }
};

export const redirectToLongUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const longUrl = await urlService.decode(req.params.urlPath);
    await urlService.incrementVisit(req.params.urlPath);
    res.status(200).json(longUrl);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await urlService.getStats(req.params.urlPath);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

export const listURLs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(_req.query.page as string, 10) || 1;
    const limit = parseInt(_req.query.limit as string, 10) || 10;
    const {
      total,
      data,
      page: currentPage,
      limit: pageSize
    } = await urlService.getAll(page, limit);
    res.status(200).json({ total, page: currentPage, limit: pageSize, data });
  } catch (err) {
    next(err);
  }
};

export const searchURLs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query.query as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query || query.length < 3) {
      res.status(400).json({ error: 'Query must be at least 3 characters' });
      return;
    }

    const {
      total,
      data,
      page: currentPage,
      limit: pageSize
    } = await urlService.search(query, page, limit);
    res.status(200).json({ total, page: currentPage, limit: pageSize, data });
  } catch (err) {
    next(err);
  }
};
