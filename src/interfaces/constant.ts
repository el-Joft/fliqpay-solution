import { IUser } from "../user/user.interface";

export interface AppConfiguration {
  SECRET_KEY: string;
  NODE_ENV: string;
  REDIS_URL: string;
  PORT: number | null;
  MONGODB_URI: string;
  MONGODB_TEST_URI: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
