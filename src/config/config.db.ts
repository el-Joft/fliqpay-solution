import * as dotenv from "dotenv";
import * as path from "path";
import { AppConfiguration } from "../interfaces/constant";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const dbConfig = {
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
  PORT: process.env.PORT || null,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI
} as AppConfiguration;
