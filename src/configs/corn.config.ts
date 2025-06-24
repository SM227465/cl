import cron from 'node-cron';
import logger from '../utils/logger.util';

const rootApi = 'https://blog-rdlk.onrender.com';

export const startCornJobs = () => {
  cron.schedule('*/14 * * * *', async () => {
    const res = await fetch(rootApi, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

    if (data?.success) {
      logger.info(`Cron job executed at ${formattedTime}`);
    }
  });
};
