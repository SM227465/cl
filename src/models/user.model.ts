import { Document, Query, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Constants
const SALT_ROUNDS = 12;
const PASSWORD_RESET_EXPIRES_MINUTES = 10;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 16;

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Enums
enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Interface for methods
interface IUserMethods {
  isPasswordCorrect(providedPassword: string, passwordFromDb: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changePasswordAfter(JWTTimestamp: number): boolean;
}

// Main User interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  avatar?: string;
  lastOtp?: string;
  lastOtpSession?: string;
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Combining both interfaces
type UserModel = IUser & IUserMethods;

const userSchema = new Schema<UserModel>(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      minlength: [NAME_MIN_LENGTH, `First name should not be less than ${NAME_MIN_LENGTH} characters`],
      maxlength: [NAME_MAX_LENGTH, `First name should not be more than ${NAME_MAX_LENGTH} characters`],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      minlength: [NAME_MIN_LENGTH, `Last name should not be less than ${NAME_MIN_LENGTH} characters`],
      maxlength: [NAME_MAX_LENGTH, `Last name should not be more than ${NAME_MAX_LENGTH} characters`],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid Email! Please provide a valid email address',
      },
      index: true,
    },
    
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.GUEST,
      uppercase: true,
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [PASSWORD_MIN_LENGTH, `Password should contain at least ${PASSWORD_MIN_LENGTH} characters`],
      maxlength: [PASSWORD_MAX_LENGTH, `Password should not be more than ${PASSWORD_MAX_LENGTH} characters`],
      select: false,
      validate: {
        validator: (value: string) => {
          // Password strength validation
          return /[!@#$%^&*(),.?":{}|<>]/.test(value);
        },
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    },

    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (this: UserModel, value: string) {
          return value === this.password;
        },
        message: 'Passwords do not match',
      },
    },

    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastOtp: { type: String, select: false, default: null },
    lastOtpSession: { type: String, select: false, default: null },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1});

// Middleware
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.confirmPassword = undefined;

    if (this.isModified('password') && !this.isNew) {
      this.passwordChangedAt = new Date();
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Query middleware to exclude inactive users
userSchema.pre(/^find/, function (next) {
  if (this instanceof Query) {
    this.find({ active: { $ne: false } });
  }
  next();
});
// Methods
userSchema.methods.isPasswordCorrect = async function (providedPassword: string, passwordFromDb: string): Promise<boolean> {
  try {
    return await bcrypt.compare(providedPassword, passwordFromDb);
  } catch (error) {
    return false;
  }
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000);

  return resetToken;
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Virtual for full name
userSchema.virtual('fullName').get(function (this: UserModel) {
  return `${this.firstName} ${this.lastName}`;
});

const User = model<UserModel>('User', userSchema);

export default User;
