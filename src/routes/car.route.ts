import express from 'express';
import { protect } from '../controllers/auth.controller';
import { createCar, getCar, getCars } from '../controllers/car.controller';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f9b1d4c23d8f9c1a7"
 *         brand:
 *           type: string
 *           example: "Toyota"
 *         carModel:
 *           type: string
 *           example: "Corolla"
 *         year:
 *           type: integer
 *           example: 2020
 *         price:
 *           type: number
 *           example: 15000
 *         status:
 *           type: string
 *           example: "available"
 *         odo:
 *           type: number
 *           example: 45000
 *         name:
 *           type: string
 *           example: "2020 Toyota Corolla GLX"
 *         image:
 *           type: string
 *           format: uri
 *           example: "https://example.com/car-image.jpg"
 *         vin:
 *           type: string
 *           example: "1HGCM82633A004352"
 *         registrationNumber:
 *           type: string
 *           example: "MH12AB1234"
 *         fuelType:
 *           type: string
 *           example: "Petrol"
 *         cc:
 *           type: integer
 *           example: 1500
 *         cylinders:
 *           type: integer
 *           example: 4
 *         transmissionType:
 *           type: string
 *           example: "Automatic"
 *         maxSpeed:
 *           type: number
 *           example: 180
 *         bodyType:
 *           type: string
 *           example: "Sedan"
 *         trimType:
 *           type: string
 *           example: "GLX"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-24T12:00:00.000Z"
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get a paginated list of cars
 *     description: Retrieves a paginated, sorted list of cars from the database.
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort order, e.g., `createdAt`, `-createdAt`, `price`, etc.
 *     responses:
 *       200:
 *         description: A list of cars with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Something went wrong while fetching cars
 */
router.get('/', getCars);

router.post('/', protect, createCar);

router.get('/:id', getCar);

export default router;
