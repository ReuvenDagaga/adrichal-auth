import mongoose from 'mongoose';
import { createServer } from './api/server';
import { config } from './config';
import { logger } from './utils/logger';

async function main() {
  try {
    // Connect to MongoDB
    logger.info({ uri: config.mongo.uri.replace(/\/\/[^@]+@/, '//***@') }, 'Connecting to MongoDB...');
    await mongoose.connect(config.mongo.uri);
    logger.info('Connected to MongoDB');

    // Create and start server
    const app = createServer();
    const port = config.service.port;

    logger.info({ port }, 'Starting server...');

    Bun.serve({
      port,
      fetch: app.fetch,
    });

    logger.info({ port }, `Server running at http://localhost:${port}`);
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

main();
