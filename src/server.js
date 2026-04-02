const createApp = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { connectDB } = require('./config/database');
const { seedUsers } = require('./config/seed');
const { seedRecords } = require('./config/seedRecords');

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Database connection established');

    // Seed default users
    await seedUsers();

    // Seed dummy financial records
    await seedRecords();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.server.port, () => {
      logger.info(`Server started successfully`, {
        port: config.server.port,
        env: config.server.env,
        nodeVersion: process.version
      });
      
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║  Finance Data Processing Backend Server                   ║');
      console.log('╠════════════════════════════════════════════════════════════╣');
      console.log(`║  🚀 Server running on: http://localhost:${config.server.port}          ║`);
      console.log(`║  � API Documentation: http://localhost:${config.server.port}/api-docs ║`);
      console.log(`║  �📝 Environment: ${config.server.env.padEnd(37)}║`);
      console.log(`║  🔧 Node Version: ${process.version.padEnd(35)}║`);
      console.log(`║  💾 Database: MongoDB Connected                            ║`);
      console.log('╠════════════════════════════════════════════════════════════╣');
      console.log('║  Default Test Accounts:                                    ║');
      console.log('║  Admin:   admin@example.com    / admin123                  ║');
      console.log('║  Analyst: analyst@example.com  / analyst123                ║');
      console.log('║  Viewer:  viewer@example.com   / viewer123                 ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('Server closed. Closing database connection...');
        await require('mongoose').connection.close();
        logger.info('Database connection closed. Process terminating...');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
