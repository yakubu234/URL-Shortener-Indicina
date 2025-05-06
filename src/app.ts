import express from 'express';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Handle unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
