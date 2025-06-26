import { Document, model, Schema, Types } from 'mongoose';

export interface ICar extends Document {
  productId: string;
  brand: string;
  carModel: string;
  year: number;
  price: number;
  status: string;
  odo: number;
  name: string;
  image: string;
  vin: string;
  registrationNumber: string;
  fuelType: string;
  cc: string;
  cylinders: string;
  transmissionType: string;
  maxSpeed: string;
  bodyType: string;
  trimType: string;
  addedBy: Types.ObjectId;
}

const carSchema = new Schema<ICar>(
  {
    productId: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    carModel: {
      type: String,
      required: [true, 'Car model is required'],
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    status: {
      type: String,
      default: 'Available',
    },
    odo: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      default: 0,
    },
    name: {
      type: String,
      required: [true, 'Car name is required'],
    },
    image: {
      type: String,
      default: '',
    },
    vin: {
      type: String,
      required: [true, 'VIN (Vehicle Identification Number) is required'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
    },
    cc: {
      type: String,
      required: [true, 'Engine displacement (cc) is required'],
    },
    cylinders: {
      type: String,
      required: [true, 'Cylinder information is required'],
    },
    transmissionType: {
      type: String,
      required: [true, 'Transmission type is required'],
    },
    maxSpeed: {
      type: String,
      required: [true, 'Maximum speed is required'],
    },
    bodyType: {
      type: String,
      required: [true, 'Body type is required'],
    },
    trimType: {
      type: String,
      required: [true, 'Trim type is required'],
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Car must have a creator'],
    },
  },
  {
    timestamps: true,
  }
);

carSchema.pre<ICar>('save', function (next) {
  this.name = `${this.year} ${this.brand} ${this.carModel} ${this.trimType}`;
  next();
});

const Car = model<ICar>('Car', carSchema);

export default Car;
