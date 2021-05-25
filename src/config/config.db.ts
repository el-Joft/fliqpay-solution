import * as dotenv from "dotenv";
import * as path from "path";
import { AppConfiguration } from "../interfaces/constant";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const dbConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 8080,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI
} as AppConfiguration;
