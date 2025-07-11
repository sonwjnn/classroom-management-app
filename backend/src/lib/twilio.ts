import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export const twilioClient = Twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string) => {
  console.log(accountSid, authToken, twilioNumber);

  try {
    const message = await twilioClient.messages.create({
      body,
      from: twilioNumber,
      to,
    });
    return message.sid;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const sendSmsVerificationCode = async (phone: string, code: string) => {
  const message = `Your Classroom Management App verification code is: ${code}. This code expires in 10 minutes.`;
  return await sendSMS(phone, message);
};

export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};
