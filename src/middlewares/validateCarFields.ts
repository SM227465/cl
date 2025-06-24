import { NextFunction, Request, Response } from 'express';

export const validateCarFields = (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = [
    'brand',
    'carModel',
    'year',
    'price',
    'vin',
    'registrationNumber',
    'fuelType',
    'cc',
    'cylinders',
    'transmissionType',
    'maxSpeed',
    'bodyType',
    'trimType',
  ];

  const missingFields = requiredFields.filter((field) => !req.body?.[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  next();
};
