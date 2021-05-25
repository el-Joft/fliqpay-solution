import jsonwebtoken from "jsonwebtoken";
import {
  TokenData,
  DataToStoredInToken
} from "../interfaces/tokenData.interface";

export default class AuthToken {
  /**
   *
   * @function
   * This function generates a jwt token
   * @param user {User}.
   * @return {String}
   */

  public static createToken(createTokenData: DataToStoredInToken): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.SECRET_KEY as string;
    const dataStoredInToken: DataToStoredInToken = {
      _id: createTokenData._id,
      email: createTokenData.email,
      isAdmin: createTokenData.isAdmin
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
    return jsonwebtoken.verify(
      token,
      process.env.SECRET_KEY as string
    ) as string;
  }
}
