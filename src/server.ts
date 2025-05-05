import app from './app';
import { connectToDatabase } from './configs/db';
import './config/redis';
import config from './configs/config';

connectToDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
});
