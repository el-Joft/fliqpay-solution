import { Request, Response, NextFunction } from "express";
import { CreateUserDto, LoginUserDto } from "../user/user.dto";
import AuthenticationService from "./authentication.service";
import StatusResponse from "../exceptions/statusResponse";

class AuthenticationController {
  public static async registration(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const userData: CreateUserDto = request.body;
    try {
      const { tokenData, user } = await AuthenticationService.register(
        response,
        userData
      );
      const data = {
        message: "User Created Successfully",
        success: true,
        token: tokenData,
        user: user
      };
      return StatusResponse.created(response, data);
    } catch (error) {
      console.log(error);
      next(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }

  public static async login(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const logInData: LoginUserDto = request.body;
    try {
      const { tokenData, user } = await AuthenticationService.login(
        response,
        logInData
      );

      const data = {
        message: "User Login Successfully",
        success: true,
        tokenData,
        user: user
      };
      return StatusResponse.created(response, data);
    } catch (error) {
      console.log(error);
      next(error);

      // const errorMsg = {
      //   message: "Something went wrong please try again later or contact admin",
      //   success: false,
      //   statusCode: 500
      // };
      // return StatusResponse.internalServerError(response, errorMsg);
    }
  }
}

export default AuthenticationController;
