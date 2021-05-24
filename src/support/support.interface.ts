import { Document } from "mongoose";
import { IUser } from "../user/user.interface";
import { IComment } from "../comment/comment.interface";

export interface ISupport extends Document {
  _id: string;
  title: string;
  description: string;
  status: string;
  comments: IComment[];
  createdBy?: IUser;
  createdAt: Date;
  updatedAt: Date;
  isArchive: boolean;
}
