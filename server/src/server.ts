import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    logger.info('SERVER', `🚀 AI Exam Coach Server listening on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
    logger.info('SERVER', `📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
  });

  // Graceful Shutdown
  const handleExit = (signal: string) => {
    logger.info('SERVER', `Received ${signal}, closing server gracefully...`);
    server.close(() => {
      logger.info('SERVER', 'Server closed successfully.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleExit('SIGINT'));
  process.on('SIGTERM', () => handleExit('SIGTERM'));
};

startServer().catch((err) => {
  logger.error('SERVER', `Fatal error during server startup: ${err.message}`, err);
});
