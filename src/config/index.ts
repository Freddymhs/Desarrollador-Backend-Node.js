import dotenv from "dotenv";
dotenv.config();

export const config = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 3000,
  morganFormat: process.env.MORGAN_FORMAT || "dev",
  urlencoded: { extended: true },
};
