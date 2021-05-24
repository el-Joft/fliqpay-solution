import mongoose, { Schema } from "mongoose";
import { ISupport } from "./support.interface";

export enum Status {
  pending = "PENDING",
  RUNNING = "RUNNING",
  closed = "CLOSED"
}

// Create Support Entity
const Support = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "PENDING",
    enum: Object.values(Status)
  },
  isArchive: {
    type: Boolean,
    default: false
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

export default mongoose.model<ISupport>("Support", Support);
