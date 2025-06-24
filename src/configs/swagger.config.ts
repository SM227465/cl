import path from 'path';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const isDevelopment = process.env.NODE_ENV === 'development';

const options: Options = {
  definition: {
    openapi: '3.1.1',
    info: {
      title: 'Car list app',
      description: 'Car list app API endpoints documented with Swagger',
      contact: {
        name: 'Sourav Mandal',
        email: 'sourav.mandal5282@gmail.com',
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://blog-rdlk.onrender.com',
        description: 'Dev',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, `../routes/*.${isDevelopment ? 'ts' : 'js'}`)],
};

export const swaggerSpec = swaggerJsdoc(options);
