import { Request, Response, NextFunction } from "express";
import StatusResponse from "../exceptions/statusResponse";
import UserRepository from "../user/user.repository";
import AuthToken from "../utils/token";
// import jsonwebtoken from "jsonwebtoken";

class checkAuthentication {
  /**
   * validator for request Query
   * @param {Object} request - express request api
   * @param {Object} response - Express response object
   * @param {Object} next - pass control to the next handler
   */
  static async checkAuthToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const token = request.headers.authorization;

      if (!token) {
        return StatusResponse.badRequest(response, {
          statusCode: 400,
          message:
            "You did not provide any token, please enter token, then retry",
          success: false
        });
      } else {
        const bearer = token.split(" ");
        const string_token = bearer[1];
        const decoded: any = AuthToken.decodeToken(string_token);
        if (!decoded) {
          return StatusResponse.unauthorized(response, {
            message: "Invalid Token",
            success: false,
            statusCode: 403
          });
        }
        const email = decoded.email;
        const user = await UserRepository.findByEmail(email);
        if (!user) {
          return StatusResponse.unauthorized(response, {
            statusCode: 403,
            success: false,
            message: "User does not exist"
          });
        }
        request.user = user;
        request.app.locals.user = {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin
        };
        return next();
      }
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }
}

export default checkAuthentication;
