import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
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