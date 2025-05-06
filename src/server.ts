import app from './app';
import { flushVisitCounts } from './jobs/flushVisitCounts';
import { connectToDatabase } from './configs/db';
import './configs/redis';
import config from './configs/config';

setInterval(flushVisitCounts, 120 * 1000); // every 120 seconds

connectToDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
});
