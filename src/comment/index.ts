import { Router } from "express";

import CommentController from "./comment.controller";
import AppValidationMiddleware from "../middleware/validation.middleware";
import checkAuthentication from "../middleware/authentication.middleware";
import { CreateCommentDto } from "./comment.dto";

const commentRouter: Router = Router();

const { validationMiddleware, checkParamsId } = AppValidationMiddleware;

const { createComment } = CommentController;
const { checkAuthToken } = checkAuthentication;

// Create
commentRouter.post(
  "/user/support/:id/comment",
  checkAuthToken,
  checkParamsId,
  validationMiddleware(CreateCommentDto),
  createComment
);

export default commentRouter;
