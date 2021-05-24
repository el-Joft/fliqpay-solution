import { Request, Response } from "express";

export default class HomeController {
  /**
   * Returns success and message when you hit the home route /
   * @name / GET
   *
   * @param request {Object} The request.
   * @param response {Object} The response.
   * @param req.body {Object} The JSON payload.
   * @remarks
   * - This function accepts two parameters, request, and response
   * - this function accepts the email and password in the request body
   *
   * @function
   * @returns {Boolean} success
   * @returns {Response} message
   *
   */
  static getHome(req: Request, res: Response): Response {
    return res.status(200).json({
      success: true,
      data: [
        {
          message: "Welcome to Fliqpay assessment solution",
          description: "Fliqpay assessment solution",
          status: "success",
          data: {
            name: "Omotayo Timothy",
            github: "@el-Joft",
            email: "ottimothy@gmail.com",
            mobile: "08136681130"
          },
          swaggerDocUrl: "/api/v1/swagger"
        }
      ]
    });
  }
}
