import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];

export default {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 3000,
  morganFormat: process.env.MORGAN_FORMAT || "dev",
  urlencoded: { extended: true },
  isProduction,
  cors: {
    origin: isProduction ? allowedOrigins : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
};
