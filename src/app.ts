import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger.config';
import errorHandler from './controllers/error.controller';
import carRouter from './routes/car.route';
import userRouter from './routes/user.route';

const app = express();

app.set('trust proxy', 'loopback');
app.use(cors());
app.options('*', cors());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://car-list-863m.onrender.com'],
    },
  })
);

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from your IP, please try again in an hour.',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    messgae: 'Hello from root route',
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/cars', carRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `can not find ${req.originalUrl} on this server`,
  });
});

// 3. Global error handler
app.use(errorHandler);

export default app;
