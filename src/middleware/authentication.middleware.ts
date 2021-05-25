import { Request, Response, NextFunction } from "express";
// import StatusResponse from "../exceptions/statusResponse";
import UserRepository from "../user/user.repository";
import AuthToken from "../utils/token";
// import jsonwebtoken from "jsonwebtoken";
import commonException from "../exceptions/common.exception";

class checkAuthentication {
  /**
   * validator for request Query
   * @param {Object} request - express request api
   * @param {Object} response - Express response object
   * @param {Object} next - pass control to the next handler
   */

  static async authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const token = request.headers.authorization;
    if (token) {
      try {
        const bearer = token.split(" ");
        const string_token = bearer[1];
        const decoded: any = AuthToken.decodeToken(string_token);
        // if (decoded) {
        const email = decoded.email;
        const user = await UserRepository.findByEmail(email);
        if (user) {
          request.user = user;
          request.app.locals.user = {
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin
          };
          next();
        } else {
          next(new commonException("User does not exist", 401));
        }
        // } else {
        //   next(new commonException("Invalid Token", 401));
      } catch {
        next(new commonException("Invalid Token", 401));
      }
    } else {
      next(
        new commonException(
          "You did not provide any token, please enter token, then retry",
          400
        )
      );
    }
  }
}

export default checkAuthentication;
