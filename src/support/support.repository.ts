import Support from "./support.model";
import { ISupport } from "./support.interface";
import { IUser } from "../user/user.interface";

export default class SupportRepository {
  /**
   * @param {supportData} supportData - Support Data
   * @param {user} user - User Creating the Instance
   * @returns {Promise<ISupport>} Created Support
   */
  static async createSupport(supportData: any, user: IUser): Promise<ISupport> {
    const supportInstance = new Support({ ...supportData, createdBy: user });
    const support = await supportInstance.save();
    return support.populate("createdBy comments", "-password").execPopulate();
  }

  /**
   * @param {string} id - ID of single support
   * @returns {Promise<ISupport>} single support
   */
  static async getSingleSupport(id: string): Promise<ISupport | null> {
    return await Support.findOne({
      _id: id,
      isArchive: false
    }).populate("createdBy comments", "-password");
  }

  /**
   * @param {string} user - current authenticated user
   * @returns {Promise<ISupport[]>} fetched resource
   */
  static async getUserSupports(user: IUser): Promise<ISupport[]> {
    return await Support.find({
      createdBy: user,
      isArchive: false
    }).populate("createdBy comments", "-password");
  }

  /**
   * @param {string} id - ID of support to update
   * @returns {Promise<ISupport>} update resource
   */
  static async updateSingleSupport(
    id: string,
    supportData: any
    // user: IUser
  ): Promise<ISupport | null> {
    return await Support.findOneAndUpdate(
      { _id: id, isArchive: false },
      { ...supportData },
      { new: true }
    ).populate("createdBy comments", "-password");
  }
}
