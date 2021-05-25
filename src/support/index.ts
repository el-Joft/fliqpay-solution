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
  viewAllSupportByAdmin,
  updateSupport,
  viewSingleSupport,
  deleteSingleSupport,
  closeSupport,
  getSupportDownloadByDateRange
} = SupportController;
const { authMiddleware } = checkAuthentication;

// Create
supportRouter.post(
  "/support",
  authMiddleware,
  validationMiddleware(CreateSupportDto),
  createSupport
);

// Get All By User
supportRouter.get("/user/supports", authMiddleware, viewSupportsByUser);

// Get All By Admin
supportRouter.get("/supports", authMiddleware, viewAllSupportByAdmin);
// Update
supportRouter.patch(
  "/user/support/:id",
  authMiddleware,
  checkParamsId,
  validationMiddleware(UpdateSupportDto),
  updateSupport
);
// Get Single
supportRouter.get(
  "/user/support/:id",
  authMiddleware,
  checkParamsId,
  viewSingleSupport
);
// Close Single Support
supportRouter.get(
  "/user/support/close/:id",
  authMiddleware,
  checkParamsId,
  closeSupport
);
// Delete Single
supportRouter.delete(
  "/user/support/:id",
  authMiddleware,
  checkParamsId,
  deleteSingleSupport
);

// Download Support
supportRouter.get(
  "/download/support",
  authMiddleware,
  getSupportDownloadByDateRange
);

export default supportRouter;
