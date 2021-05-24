import { Request, Response, NextFunction } from "express";
import { CreateSupportDto } from "./support.dto";
import SupportService from "./support.service";
import StatusResponse from "../exceptions/statusResponse";
import { ISupport } from "./support.interface";

class SupportController {
  public static async createSupport(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const supportData: CreateSupportDto = request.body;
    try {
      const support = await SupportService.createSupport(
        request,
        response,
        supportData
      );
      const data = {
        message: "Support Created Successfully",
        success: true,
        support: support
      };
      return StatusResponse.created(response, data);
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

  public static async viewSupportsByUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const supports: ISupport[] = await SupportService.viewSupportsByUser(
        request,
        response
      );
      const data = {
        success: true,
        statusCode: 200,
        support: supports
      };
      return StatusResponse.success(response, data);
    } catch (error) {
      console.log(error);
      // next(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }

  public static async updateSupport(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const supportData = request.body;
      const supportId = request.params.id;
      const support: ISupport | null = await SupportService.updateSupport(
        request,
        response,
        supportData,
        supportId
      );
      const data = {
        success: true,
        statusCode: 200,
        support: support
      };
      return StatusResponse.success(response, data);
    } catch (error) {
      console.log(error);
      // next(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }

  public static async viewSingleSupport(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const supportId = request.params.id;
      const support: ISupport | null = await SupportService.singleSupport(
        request,
        response,
        supportId
      );
      const data = {
        success: true,
        statusCode: 200,
        support: support
      };
      return StatusResponse.success(response, data);
    } catch (error) {
      console.log(error);
      // next(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }
  public static async deleteSingleSupport(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const supportId = request.params.id;
      const msg: ISupport | null = await SupportService.deleteSingleSupport(
        request,
        response,
        supportId
      );
      const data = {
        success: true,
        statusCode: 200,
        message: msg
      };
      return StatusResponse.success(response, data);
    } catch (error) {
      console.log(error);
      // next(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }

  public static async closeSupport(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const supportId = request.params.id;
      const support: ISupport | null = await SupportService.closeSingleSupport(
        request,
        response,
        supportId
      );
      const data = {
        message: "Support has been closed suucessfully",
        success: true,
        statusCode: 200,
        support: support
      };
      return StatusResponse.success(response, data);
    } catch (error) {
      console.log(error);
      // next(error);
      const errorMsg = {
        message: "Something went wrong please try again later or contact admin",
        success: false,
        statusCode: 500
      };
      return StatusResponse.internalServerError(response, errorMsg);
    }
  }
}

export default SupportController;
