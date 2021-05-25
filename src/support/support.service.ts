import { Response, Request } from "express";
import { CreateSupportDto } from "./support.dto";
import SuportRepository from "./support.repository";
import commonException from "../exceptions/common.exception";
import SupportRepository from "./support.repository";
import CsvManager from "../utils/csv.manager";

class SupportService {
  public static async createSupport(
    request: Request,
    res: Response,
    supportData: CreateSupportDto
  ): Promise<any | Response<any, Record<string, any>>> {
    const support = await SuportRepository.createSupport(
      supportData,
      request.user
    );
    return support;
  }
  public static async viewSupportsByUser(
    request: Request,
    res: Response
  ): Promise<any | Response<any, Record<string, any>>> {
    const user = request.user;
    const supports = await SuportRepository.getUserSupports(user);

    return supports;
  }

  public static async updateSupport(
    request: Request,
    res: Response,
    supportData: any,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    const user = request.user;
    const getSupport = await SuportRepository.getSingleSupport(supportId);
    if (!getSupport) {
      throw new commonException(
        `Support with this ID ${supportId} does not exists`,
        404
      );
    }
    if (getSupport.status === "CLOSED") {
      throw new commonException(
        "You are not allowed to update this Support",
        400
      );
    }
    // check if the user is not the creator or if the user is not an admin
    // assume admin can edit support
    if (
      getSupport.createdBy!._id.toString() !== user!._id.toString() &&
      !user.isAdmin
    ) {
      throw new commonException(
        "You are not allowed to update this Support",
        403
      );
    }
    const support = await SuportRepository.updateSingleSupport(
      supportId,
      supportData
      // user
    );

    return support;
  }

  public static async singleSupport(
    request: Request,
    res: Response,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    const user = request.user;
    const getSupport = await SuportRepository.getSingleSupport(supportId);

    if (!getSupport) {
      throw new commonException(
        `Support with this ID ${supportId} does not exists`,
        404
      );
    }
    // check if the user is not the creator or if the user is not an admin
    if (
      getSupport.createdBy!._id.toString() !== user!._id.toString() &&
      !user.isAdmin
    ) {
      throw new commonException(
        "You are not allowed to view this Support",
        403
      );
    }

    return getSupport;
  }

  public static async deleteSingleSupport(
    request: Request,
    res: Response,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    const user = request.user;
    const getSupport = await SuportRepository.getSingleSupport(supportId);
    if (!getSupport) {
      throw new commonException(
        `Support with this ID ${supportId} does not exists`,
        404
      );
    }
    // check if the user is not the creator or if the user is not an admin
    if (
      getSupport.createdBy!._id.toString() !== user!._id.toString() &&
      !user.isAdmin
    ) {
      throw new commonException(
        "You are not allowed to delete this Support",
        403
      );
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
  }

  public static async closeSingleSupport(
    request: Request,
    res: Response,
    supportId: string
  ): Promise<any | Response<any, Record<string, any>>> {
    const user = request.user;
    const getSupport = await SuportRepository.getSingleSupport(supportId);
    if (!getSupport) {
      throw new commonException(
        `Support with this ID ${supportId} does not exists`,
        404
      );
    }
    if (getSupport.status === "CLOSED") {
      throw new commonException("You cannot close, a CLOSED support", 400);
    }
    // check if the user is not the creator or if the user is not an admin
    if (
      getSupport.createdBy!._id.toString() !== user!._id.toString() &&
      !user.isAdmin
    ) {
      throw new commonException(
        "You are not allowed to close this Support",
        403
      );
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
  }

  public static async viewAllSupportByAdmin(
    request: Request,
    res: Response
  ): Promise<any | Response<any, Record<string, any>>> {
    const user = request.user;
    if (!user.isAdmin) {
      throw new commonException(
        "You are not allowed to view Support, Permission Denied",
        403
      );
    }
    const supports = await SuportRepository.geAllSupports();

    return supports;
  }
  public static async generateSupportDownload(
    request: Request,
    response: Response
  ) {
    const startDate = request.query.startDate;
    const endDate = request.query.endDate;

    const user = request.user;

    if (!user.isAdmin) {
      throw new commonException(
        "You are not allowed to view Support, Permission Denied",
        403
      );
    }
    let supports;
    if (startDate && endDate) {
      supports = await SupportRepository.getSupportByDateRange(
        startDate,
        endDate
      );
    } else {
      const currentDatetime = new Date();
      const lastMonth = currentDatetime.setMonth(
        currentDatetime.getMonth() - 1
      );
      supports = await SupportRepository.getSupportByDate(lastMonth);
    }

    if (supports.length <= 0) {
      throw new commonException(
        "No Closed Support within the time frame selected",
        404
      );
    }
    const fileName = "SupportReport.csv";
    const csvGenerated = await CsvManager.generateCsv(
      response,
      supports,
      fileName
    );
    return csvGenerated;
  }
}

export default SupportService;
