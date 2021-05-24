import Comment from "./comment.model";
import { IComment } from "./comment.interface";
import { IUser } from "../user/user.interface";
import { ISupport } from "../support/support.interface";

export default class CommentRepository {
  /**
   * @param {commentData} commentData - Support Data
   * @param {user} user - User Creating the comment
   * @returns {Promise<IComment>} Created Comment
   */
  static async createComment(
    commentData: any,
    user: IUser,
    getSupport: ISupport
  ): Promise<IComment> {
    const commentInstance = new Comment({ ...commentData, createdBy: user });
    const comment = await commentInstance.save();
    getSupport.comments!.push(comment);
    await getSupport.save();
    return comment.populate("createdBy", "-password").execPopulate();
  }
}
