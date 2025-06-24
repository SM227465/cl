import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);

export const sendOtp = async (countryCode: string, phoneNumber: string): Promise<any> => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = await twilioClient.messages.create({
      body: `Your OTP for login: ${otp}`,
      from: '+12562063504',
      to: '+917074639326',
    });
    return { message, otp };
  } catch (error) {
    return { error };
  }
};
