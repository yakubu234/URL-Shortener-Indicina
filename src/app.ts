import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { redirectToLongUrl } from './controllers/shortlink.controller';

const app = express();

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
