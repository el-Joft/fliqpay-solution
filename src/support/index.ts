import { Router } from "express";

import SupportController from "./support.controller";
import AppValidationMiddleware from "../middleware/validation.middleware";
import { CreateSupportDto, UpdateSupportDto } from "./support.dto";
import checkAuthentication from "../middleware/authentication.middleware";

const supportRouter: Router = Router();

const { validationMiddleware, checkParamsId } = AppValidationMiddleware;

const {
  createSupport,
  viewSupportsByUser,
  updateSupport,
  viewSingleSupport,
  deleteSingleSupport,
  closeSupport
} = SupportController;
const { checkAuthToken } = checkAuthentication;

// Create
supportRouter.post(
  "/support",
  checkAuthToken,
  validationMiddleware(CreateSupportDto),
  createSupport
);

// Get All
supportRouter.get("/user/supports", checkAuthToken, viewSupportsByUser);
// Update
supportRouter.patch(
  "/user/support/:id",
  checkAuthToken,
  checkParamsId,
  validationMiddleware(UpdateSupportDto),
  updateSupport
);
// Get Single
supportRouter.get(
  "/user/support/:id",
  checkAuthToken,
  checkParamsId,
  viewSingleSupport
);
// Close Single Support
supportRouter.get(
  "/user/support/close/:id",
  checkAuthToken,
  checkParamsId,
  closeSupport
);
// Delete Single
supportRouter.delete(
  "/user/support/:id",
  checkAuthToken,
  checkParamsId,
  deleteSingleSupport
);

export default supportRouter;
