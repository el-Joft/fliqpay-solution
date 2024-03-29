import { Request, Response, NextFunction } from "express";
import { CreateCommentDto } from "./comment.dto";
import StatusResponse from "../exceptions/statusResponse";
import CommentService from "./comment.service";

class CommentController {
  public static async createComment(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const commentData: CreateCommentDto = request.body;
    try {
      const comment = await CommentService.createComment(
        request,
        response,
        commentData
      );
      const data = {
        message: "Comment Created Successfully",
        success: true,
        comment: comment
      };
      return StatusResponse.created(response, data);
    } catch (error) {
      next(error);
    }
  }
}

export default CommentController;
