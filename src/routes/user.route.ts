import express from 'express';
import {
  signup,
  emailLogin,
  refreshToken,
  phoneLogin,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';

// calling Router function of express
const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with provided details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - password
 *               - confirmPassword
 *               - countryCode
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: User's password confirmation
 *               countryCode:
 *                 type: string
 *                 description: User's country code
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account Created Successfully
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: Access token for authentication
 *                         expiresIn:
 *                           type: integer
 *                           description: Expiration time for the access token
 *                           example: 3600000
 *                         tokenExpireUnit:
 *                           type: string
 *                           description: Unit for token expiration time
 *                           example: millisecond
 *                     refresh:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: Refresh token for renewing access
 *                         expiresIn:
 *                           type: integer
 *                           description: Expiration time for the refresh token
 *                           example: 604800000
 *                         tokenExpireUnit:
 *                           type: string
 *                           description: Unit for token expiration time
 *                           example: millisecond
 *                 user:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phoneNumber:
 *                       type: string
 *                     countryCode:
 *                       type: string
 *       400:
 *         description: Bad Request - A user already exists with this email
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
 *                   example: A user exists with this email; if it's you, please login.
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/v1/auth/login/email:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticates a user with email and password. Returns an access and refresh token along with user information (excluding the password).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "userPassword123!"
 *                 description: The user's password.
 *           required:
 *             - email
 *             - password
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                           description: JWT access token.
 *                         expiresIn:
 *                           type: integer
 *                           example: 3600000
 *                           description: Access token expiration time in milliseconds.
 *                         tokenExpireUnit:
 *                           type: string
 *                           example: "millisecond"
 *                           description: Unit of expiration time for access token.
 *                     refresh:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                           description: JWT refresh token.
 *                         expiresIn:
 *                           type: integer
 *                           example: 604800000
 *                           description: Refresh token expiration time in milliseconds.
 *                         tokenExpireUnit:
 *                           type: string
 *                           example: "millisecond"
 *                           description: Unit of expiration time for refresh token.
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                       description: Unique identifier of the user.
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                       description: The user's first name.
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                       description: The user's last name.
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                       description: The user's email.
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                       description: The user's phone number.
 *                     countryCode:
 *                       type: string
 *                       example: "US"
 *                       description: The user's country code.
 *       400:
 *         description: Missing email or password in request body.
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
 *                   example: "Please provide an email and password."
 *       401:
 *         description: Authentication failed due to incorrect email or password.
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
 *                   example: "Incorrect email or password"
 */
router.post('/login/email', emailLogin);

/**
 * @swagger
 * /api/v1/auth/login/phone:
 *   post:
 *     summary: Phone login with OTP verification
 *     description: Allows users to login by receiving an OTP on their phone number.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: "+1"
 *                 description: The country code for the phone number.
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *                 description: The user's phone number.
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *                 otpSession:
 *                   type: string
 *                   example: "abc123otpSessionId"
 *       400:
 *         description: Missing countryCode or phoneNumber
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Please provide countryCode and phoneNumber"
 *       404:
 *         description: User not found with this countryCode and phoneNumber
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found with this countryCode and phoneNumber"
 */
router.post('/login/phone', phoneLogin);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for phone login
 *     description: Verifies the OTP sent to the user's phone number and provides access and refresh tokens on success.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: The OTP code sent to the user's phone.
 *               otpSession:
 *                 type: string
 *                 example: "abc123otpSessionId"
 *                 description: The OTP session token.
 *     responses:
 *       200:
 *         description: OTP verified successfully, returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                         expiresIn:
 *                           type: integer
 *                           example: 3600000
 *                         tokenExpireUnit:
 *                           type: string
 *                           example: "millisecond"
 *                     refresh:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                         expiresIn:
 *                           type: integer
 *                           example: 604800000
 *                         tokenExpireUnit:
 *                           type: string
 *                           example: "millisecond"
 *                 user:
 *                   type: object
 *                   description: Information about the authenticated user.
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60c72b2f9b1e8e3a2d8f3d71"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       400:
 *         description: Missing or invalid OTP/session token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Please provide otp and otpSession"
 *       401:
 *         description: Invalid OTP or user no longer exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "The user belonging to this token does no longer exist"
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: An error occurred
 *         errorCode:
 *           type: integer
 *           description: Application-specific error code
 *           example: 400
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using a valid refresh token
 *     description: Endpoint to refresh the access token by providing a valid refresh token. Requires the token to be of type "refresh".
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token provided during login.
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: New access token
 *                         expiresIn:
 *                           type: integer
 *                           description: Access token expiration time in milliseconds
 *                           example: 3600000
 *                         tokenExpireUnit:
 *                           type: string
 *                           example: millisecond
 *       400:
 *         description: Invalid token type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - No token provided or user no longer exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     description: Generates a password reset token and sends a reset email to the specified user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - domain
 *               - path
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user requesting password reset.
 *                 example: user@example.com
 *               domain:
 *                 type: string
 *                 description: The domain where the reset link will point.
 *                 example: https://example.com
 *               path:
 *                 type: string
 *                 description: The specific path on the domain for password reset.
 *                 example: reset-password
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email sent to user@example.com"
 *       400:
 *         description: Missing required fields in the request.
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
 *                   example: "Please provide these, email, domain, path"
 *       404:
 *         description: No user found with the provided email address.
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
 *                   example: "There is no user with this email address."
 *       500:
 *         description: Server error occurred while sending the email.
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
 *                   example: "There was an error sending the email, Try again later."
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   patch:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid reset token provided as a path parameter.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token provided to the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password to set.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password.
 *             example:
 *               password: "NewPassword123!"
 *               confirmPassword: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password reset was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: true
 *                 message: "Your password reset was successful"
 *       400:
 *         description: Invalid or expired token, or missing/invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Token is invalid or has expired"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 */
router.patch('/reset-password/:token', resetPassword);

export default router;
