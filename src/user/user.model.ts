import mongoose from "mongoose";

import { IUser } from "./user.interface";

// Create User Entity
const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);

const userModel = mongoose.model<IUser & mongoose.Document>("User", UserSchema);

export default userModel;
