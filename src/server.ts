import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger.util';
import connectWithDB from './configs/db.config';
import { startCornJobs } from './configs/corn.config';

process.on('uncaughtException', (error) => {
  logger.info('UNCAUGHT EXCEPTION!');
  logger.error(error.name, error.message);
  process.exit(1);
});

dotenv.config();

const port = process.env.PORT || 8000;
connectWithDB();
startCornJobs();

const server = app.listen(port, () => {
  logger.info(`Server is running in ${process.env.NODE_ENV} environment on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  logger.info('UNHANDLED REJECTION!');
  logger.error(error);
  server.close(() => process.exit(1));
});
