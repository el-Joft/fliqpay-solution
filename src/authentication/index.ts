import { Router } from "express";

import AuthenticationController from "./authentication.controller";
import AppValidationMiddleware from "../middleware/validation.middleware";
import { CreateUserDto, LoginUserDto } from "../user/user.dto";

const authenticationRouter: Router = Router();
const { validationMiddleware } = AppValidationMiddleware;
const { registration, login } = AuthenticationController;

authenticationRouter.post(
  "/register",
  validationMiddleware(CreateUserDto),
  registration
);

authenticationRouter.post("/login", validationMiddleware(LoginUserDto), login);

export default authenticationRouter;
