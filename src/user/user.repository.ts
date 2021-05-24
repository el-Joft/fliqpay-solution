import UserEntity from "../user/user.model";
import { CreateUserDto } from "../user/user.dto";
import { IUser } from "../user/user.interface";

export default class UserRepository {
  /**
   * Function for adding a user to the database
   * @param {CreateUserInput} userDetails - User details to be saved
   * @returns {Promise<User>} saved datase object
   */
  static async createUser(userDetails: CreateUserDto): Promise<IUser> {
    const user = new UserEntity(userDetails);
    return await user.save();
  }

  /**
   * Find a user using email address
   * @param {string} email - unique email to fetch user
   * @returns {Promise<User | null>} saved datase user object or null if there is no match
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    return await UserEntity.findOne({ email });
  }
}
