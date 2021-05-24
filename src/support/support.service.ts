import { Response, Request } from "express";
import { CreateSupportDto } from "./support.dto";
import StatusResponse from "../exceptions/statusResponse";
import SuportRepository from "./support.repository";

class SupportService {
  public static async createSupport(
    request: Request,
    res: Response,
    supportData: CreateSupportDto
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const support = await SuportRepository.createSupport(
        supportData,
        request.user
      );
      return support;
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }
  public static async viewSupportsByUser(
    request: Request,
    res: Response
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const user = request.user;
      const supports = await SuportRepository.getUserSupports(user);

      return supports;
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }
  public static async updateSupport(
    request: Request,
    res: Response,
    supportData: any,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const user = request.user;
      const getSupport = await SuportRepository.getSingleSupport(supportId);
      if (!getSupport) {
        const errorMsg = {
          message: `Support with this ID ${supportId} does not exist`,
          success: false,
          statusCode: 400
        };
        return StatusResponse.notfound(res, errorMsg);
      }
      if (getSupport.status === "CLOSED") {
        const errorMsg = {
          message: "You are not allowed to update a closed Support",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      // check if the user is not the creator or if the user is not an admin
      // assume admin can edit support
      if (
        getSupport.createdBy!._id.toString() !== user!._id.toString() &&
        !user.isAdmin
      ) {
        const errorMsg = {
          message: "You are not allowed to update this Support",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      const support = await SuportRepository.updateSingleSupport(
        supportId,
        supportData
        // user
      );

      return support;
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }

  public static async singleSupport(
    request: Request,
    res: Response,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const user = request.user;
      const getSupport = await SuportRepository.getSingleSupport(supportId);
      if (!getSupport) {
        const errorMsg = {
          message: `Support with this ID ${supportId} does not exist`,
          success: false,
          statusCode: 400
        };
        return StatusResponse.notfound(res, errorMsg);
      }
      // check if the user is not the creator or if the user is not an admin
      if (
        getSupport.createdBy!._id.toString() !== user!._id.toString() &&
        !user.isAdmin
      ) {
        const errorMsg = {
          message: "You are not allowed to view this Support",
          success: false,
          statusCode: 403
        };
        return StatusResponse.forbidden(res, errorMsg);
      }

      return getSupport;
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }

  public static async deleteSingleSupport(
    request: Request,
    res: Response,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const user = request.user;
      const getSupport = await SuportRepository.getSingleSupport(supportId);
      if (!getSupport) {
        const errorMsg = {
          message: `Support with this ID ${supportId} does not exist`,
          success: false,
          statusCode: 400
        };
        return StatusResponse.notfound(res, errorMsg);
      }
      // check if the user is not the creator or if the user is not an admin
      if (
        getSupport.createdBy!._id.toString() !== user!._id.toString() &&
        !user.isAdmin
      ) {
        const errorMsg = {
          message: "You are not allowed to delete this Support",
          success: false,
          statusCode: 403
        };
        return StatusResponse.forbidden(res, errorMsg);
      }

      const supportData = {
        isArchive: true
      };
      await SuportRepository.updateSingleSupport(
        supportId,
        supportData
        // user
      );

      return "Support Deleted Successfully";
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }

  public static async closeSingleSupport(
    request: Request,
    res: Response,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    try {
      const user = request.user;
      const getSupport = await SuportRepository.getSingleSupport(supportId);
      if (!getSupport) {
        const errorMsg = {
          message: `Support with this ID ${supportId} does not exist`,
          success: false,
          statusCode: 400
        };
        return StatusResponse.notfound(res, errorMsg);
      }
      if (getSupport.status === "CLOSED") {
        const errorMsg = {
          message: "You cannot close, a CLOSED support",
          success: false,
          statusCode: 400
        };
        return StatusResponse.badRequest(res, errorMsg);
      }
      // check if the user is not the creator or if the user is not an admin
      if (
        getSupport.createdBy!._id.toString() !== user!._id.toString() &&
        !user.isAdmin
      ) {
        const errorMsg = {
          message: "You are not allowed to close this Support",
          success: false,
          statusCode: 403
        };
        return StatusResponse.forbidden(res, errorMsg);
      }

      const supportData = {
        status: "CLOSED",
        completedAt: new Date()
      };
      const support = await SuportRepository.updateSingleSupport(
        supportId,
        supportData
        // user
      );

      return support;
    } catch (error) {
      console.log(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(res, errorMsg);
    }
  }
}

export default SupportService;
