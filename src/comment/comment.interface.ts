import { Document } from "mongoose";
import { IUser } from "../user/user.interface";

export interface IComment extends Document {
  comment: string;
  createdBy?: IUser;
  createdAt: Date;
  updatedAt: Date;
  isArchive: boolean;
}
