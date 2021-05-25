import { Response } from "express";
import { CreateUserDto, LoginUserDto } from "../user/user.dto";
import { hashPassword, verifyPasswordMatch } from "../utils/password";
import Authtoken from "../utils/token";
import UserRepository from "../user/user.repository";
import { CreateUserRO, IUser } from "../user/user.interface";
import commonException from "../exceptions/common.exception";

class AuthenticationService {
  public static async register(
    res: Response,
    userData: CreateUserDto
  ): Promise<any | CreateUserRO | Response<any, Record<string, any>>> {
    const email = userData.email;
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new commonException(
        `User with this email ${userData.email} already exists`,
        400
      );
    }
    const hashedPassword = await hashPassword(userData.password);
    const user = await UserRepository.createUser({
      ...userData,
      password: hashedPassword
    });
    const createTokenData = {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    }
    const tokenData = Authtoken.createToken(createTokenData);
    return { tokenData, user };
  }

  public static async login(
    res: Response,
    userData: LoginUserDto
  ): Promise<any | CreateUserRO | Response<any, Record<string, any>>> {
    const { email, password } = userData;
    const user: IUser | null = await UserRepository.findByEmail(email);
    if (
      !user ||
      !(await verifyPasswordMatch(
        password,
        user.get("password", null, { getters: false })
      ))
    ) {
      throw new commonException("Invalid Login Details", 400);
    }
    const tokenData = Authtoken.createToken(user);

    return { tokenData, user };
  }
}

export default AuthenticationService;
