import mongoose from "mongoose";
import { IComment } from "../comment/comment.interface";
const { Schema } = mongoose;

// Create Comment Entity
const Comment = new Schema({
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  updatedAt: {
    type: Date
  },
  isArchive: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<IComment>("Comment", Comment);
