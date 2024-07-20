import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  frontend_domain: process.env.FRONTEND_DOMAIN,
  sms_sid: process.env.SMS_SID,
  sms_authtoken: process.env.SMS_AUTHTOKEN,
  smsfromnumber: process.env.SMS_FROM_NUMBER,
};

export const config = {
  get(key) {
    const value = _config[key];
    if (!value) {
      console.log(`The ${key} variable not found`);
      process.exit();
    }
    return value;
  },
};
