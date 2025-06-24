import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.util';
dotenv.config();

const localDB = process.env.LOCAL_DB_URL!;
const cloudDB = process.env.CLOUD_DB_URL!;

const connectWithDB = () => {
  mongoose
    .set('strictQuery', false)
    .connect(cloudDB, { dbName: 'car-list' })
    .then(() => logger.info('Connected to MongoDB.'))
    .catch((error) => {
      logger.error('Failed to connect with MongoDB.');
      logger.error(error.message);
      process.exit(1);
    });
};

export default connectWithDB;
