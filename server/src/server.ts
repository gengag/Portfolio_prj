import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  const app = createApp();

  const port = Number(ENV.PORT) || 5000;
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info('SERVER', `🚀 AI Exam Coach Server listening on port ${port} [${ENV.NODE_ENV}]`);
    logger.info('SERVER', `📡 Health Check: http://localhost:${port}/api/health`);
  });

  // Connect to Database asynchronously so port binds immediately for cloud health checks
  connectDB().catch((err) => {
    logger.error('SERVER', `Initial MongoDB connection error: ${err.message}`);
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
