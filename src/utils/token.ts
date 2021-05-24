import jsonwebtoken from "jsonwebtoken";
import {
  TokenData,
  DataToStoredInToken
} from "../interfaces/tokenData.interface";
import { IUser } from "../user/user.interface";

export default class AuthToken {
  /**
   *
   * @function
   * This function generates a jwt token
   * @param user {User}.
   * @return {String}
   */

  public static createToken(user: IUser): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.SECRET_KEY as string;
    const dataStoredInToken: DataToStoredInToken = {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };
    return {
      expiresIn,
      token: jsonwebtoken.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  /**
   *
   * @function
   * This function decodes a json token
   * @param token {String}.
   * @return {String}
   */
  public static decodeToken(token: string): string | object | any {
    try {
      return jsonwebtoken.verify(
        token,
        process.env.SECRET_KEY as string
      ) as string;
    } catch (error) {
      return false;
    }
  }
}
