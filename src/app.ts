import express from 'express';
import routes from './routes';
import cors from 'cors';
import config from './configs/config';
import { errorHandler } from './middleware/errorHandler';
import { redirectToLongUrl } from './controllers/shortlink.controller';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: config.allowedMethods,
    credentials: true
  })
);

app.use(express.json());
app.use('/api', routes);
app.get('/:urlPath', redirectToLongUrl);

// Handle unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
