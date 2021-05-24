import { Response, Request } from "express";
import { CreateCommentDto } from "./comment.dto";
import StatusResponse from "../exceptions/statusResponse";
import CommentRepository from "./comment.repository";
import SuportRepository from "../support/support.repository";

class CommentService {
  public static async createComment(
    request: Request,
    res: Response,
    commentData: CreateCommentDto
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const { id } = request.params;
      const user = request.user;

      const getSupport = await SuportRepository.getSingleSupport(id);
      if (!getSupport) {
        const errorMsg = {
          message: `Support with this ID ${id} does not exist`,
          success: false,
          statusCode: 400
        };
        return StatusResponse.notfound(res, errorMsg);
      }

      if (getSupport.status === "CLOSED") {
        const errorMsg = {
          message: "You cannot comment on a closed Support",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      // check if the user is not the creator or if the user is not an admin
      // assume admin can edit support
      if (
        getSupport.createdBy!._id.toString() !== user!._id.toString() &&
        !user.isAdmin
      ) {
        const errorMsg = {
          message: "You are not allowed to comment on this Support",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      // check if the support has no comment by the admin

      if (getSupport.comments!.length === 0 && !user.isAdmin) {
        const errorMsg = {
          message: "No admin has commented on this support",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }

      const comment = await CommentRepository.createComment(
        commentData,
        request.user,
        getSupport
      );
      const supportData = {
        status: "RUNNING"
      };
      await SuportRepository.updateSingleSupport(id, supportData);

      return comment;
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }
}

export default CommentService;
