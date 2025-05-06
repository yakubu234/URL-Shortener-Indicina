import { Router } from 'express';
import { validate } from '../middleware/validate';
import { encodeSchema, decodeSchema } from '../validations/url.validation';
import {
  encodeURL,
  decodeURL,
  getStats,
  listURLs,
  redirectToLongUrl,
  searchURLs
} from '../controllers/shortlink.controller';

const router = Router();

router.post('/encode', validate(encodeSchema), encodeURL);
router.post('/decode', validate(decodeSchema), decodeURL);
router.get('/statistic/:urlPath', getStats);
router.get('/list', listURLs);
router.get('/search', searchURLs);
router.get('/:urlPath', redirectToLongUrl); // this will be moved outside /api in real use

export default router;
