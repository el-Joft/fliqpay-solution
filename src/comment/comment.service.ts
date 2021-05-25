import { Response, Request } from "express";
import { CreateCommentDto } from "./comment.dto";
import CommentRepository from "./comment.repository";
import SuportRepository from "../support/support.repository";
import commonException from "../exceptions/common.exception";
class CommentService {
  public static async createComment(
    request: Request,
    res: Response,
    commentData: CreateCommentDto
  ): Promise<any | Response<any, Record<string, any>>> {
    const { id } = request.params;
    const user = request.user;

    const getSupport = await SuportRepository.getSingleSupport(id);
    if (!getSupport) {
      throw new commonException(
        `Support with this ID ${id} does not exists`,
        404
      );
    }

    if (getSupport.status === "CLOSED") {
      throw new commonException("You cannot comment on a closed Support", 400);
    }
    // check if the user is not the creator or if the user is not an admin
    // assume admin can edit support
    if (
      getSupport.createdBy!._id.toString() !== user!._id.toString() &&
      !user.isAdmin
    ) {
      throw new commonException(
        "You are not allowed to comment on this Support",
        403
      );
    }
    // check if the support has no comment by the admin

    if (getSupport.comments!.length === 0 && !user.isAdmin) {
      throw new commonException("No admin has commented on this support", 400);
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
  }
}

export default CommentService;
