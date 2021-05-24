import { Response } from "express";
import { CreateUserDto, LoginUserDto } from "../user/user.dto";
import StatusResponse from "../exceptions/statusResponse";
import { hashPassword, verifyPasswordMatch } from "../utils/password";
import Authtoken from "../utils/token";
import UserRepository from "../user/user.repository";
import { CreateUserRO, IUser } from "../user/user.interface";

class AuthenticationService {
  public static async register(
    res: Response,
    userData: CreateUserDto
  ): Promise<any | CreateUserRO | Response<any, Record<string, any>>> {
    try {
      const email = userData.email;
      if (await UserRepository.findByEmail(email)) {
        const errorMsg = {
          message: `User with this email ${email} already exist`,
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      const hashedPassword = await hashPassword(userData.password);
      const user = await UserRepository.createUser({
        ...userData,
        password: hashedPassword
      });
      const tokenData = Authtoken.createToken(user);
      return { tokenData, user };
    } catch (error) {
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }

  public static async login(
    res: Response,
    userData: LoginUserDto
  ): Promise<any | CreateUserRO | Response<any, Record<string, any>>> {
    try {
      const { email, password } = userData;
      const user: IUser | null = await UserRepository.findByEmail(email);
      if (
        !user ||
        !(await verifyPasswordMatch(
          password,
          user.get("password", null, { getters: false })
        ))
      ) {
        const errorMsg = {
          message: "Invalid Login Details",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      const tokenData = Authtoken.createToken(user);

      // const cookie = this.createCookie(tokenData);
      return { tokenData, user };
    } catch (error) {
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }
}

export default AuthenticationService;
