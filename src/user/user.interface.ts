import { Document } from "mongoose";
import { TokenData } from "../interfaces/tokenData.interface";

export interface IUser extends Document {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInputDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface CreateUserRO {
  tokenData: TokenData;
  user: User;
}
