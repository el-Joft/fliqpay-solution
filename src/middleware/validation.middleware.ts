import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { validate, ValidationError, isMongoId } from "class-validator";
import { RequestHandler } from "express";
import StatusResponse from "../exceptions/statusResponse";

class AppValidationMiddleware {
  public static validationMiddleware<T>(
    type: any,
    skipMissingProperties = false
  ): RequestHandler {
    /**
     * @param {object} req Takes Support request
     * @param {object} res Response to request
     * @param {object} next Move to the next function
     * @return {object} DTO
     */
    return (req, res, next) => {
      validate(plainToClass(type, req.body), { skipMissingProperties }).then(
        (errors: ValidationError[]) => {
          if (errors.length > 0) {
            const err: any[] = [];
            errors.map((error: ValidationError) => {
              const data = {
                field: error.property,
                message: Object.values(error.constraints || "").join("")
              };
              err.push(data);
            });
            return StatusResponse.unprocessableEntity(res, {
              success: false,
              statusCode: 422,
              errors: err
            });
          } else {
            next();
          }
        }
      );
    };
  }

  /**
   * @param {object} req Takes Support request
   * @param {object} res Response to request
   * @param {object} next Move to the next function
   * @return {object} ID params validation response to support
   */
  static checkParamsId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    const id = req.params.id;
    const checkedResult = isMongoId(id);
    if (!checkedResult) {
      const errMsg = {
        message: "ID passed is Invalid",
        statusCode: 400,
        success: false
      };
      return StatusResponse.badRequest(res, errMsg);
    }
    return next();
  }
}
export default AppValidationMiddleware;
