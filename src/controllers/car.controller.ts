import Car from '../models/car.model';
import AppError from '../utils/app-error.util';
import catchAsync from '../utils/catch-async.util';

export const createCar = catchAsync(async (req, res) => {
  const {
    brand,
    carModel,
    year,
    price,
    status,
    odo,
    vin,
    registrationNumber,
    fuelType,
    cc,
    cylinders,
    transmissionType,
    maxSpeed,
    bodyType,
    trimType,
    image,
  } = req.body;

  const name = `${year} ${brand} ${carModel} ${trimType}`;

  const car = await Car.create({
    brand,
    carModel,
    year,
    price,
    status,
    odo,
    name,
    image,
    vin,
    registrationNumber,
    fuelType,
    cc,
    cylinders,
    transmissionType,
    maxSpeed,
    bodyType,
    trimType,
  });

  res.status(201).json({
    success: true,
    message: 'Car created successfully',
    data: car,
  });
});

export const getCars = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort?.toString() || '-createdAt';

  const cars = await Car.find().skip(skip).limit(limit).sort(sort);
  const total = await Car.countDocuments();

  res.status(200).json({
    success: true,
    results: cars.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: cars,
  });
});

export const getCar = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const car = await Car.findById(id);

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  let externalCarData = null;

  try {
    const response = await fetch(process.env.EXTERNAL_API! + `/${car.productId}`, {
      method: 'GET',
      headers: {
        Referer: 'https://www.mycar-india.com/',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
      },
    });

    if (!response.ok) {
      return next(new AppError('External API error', 503));
    }

    externalCarData = await response.json();
  } catch (error) {
    return next(new AppError('Failed to fetch external car data', 502));
  }

  res.status(200).json({
    success: true,
    data: externalCarData?.data,
  });
});
