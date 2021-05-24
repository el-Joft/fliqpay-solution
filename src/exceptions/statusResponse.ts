import { Response } from "express";

/**
 * @description - This class is all about server response
 * @returns {class} Response
 */
class StatusResponse {
  /**
   * @description - created response
   * @param {object} res
   * @param {object} data
   * @returns {object} Created
   */
  static created(res: Response, data: Object) {
    return res.status(201).json(data);
  }
  /**
   * @description - success response
   * @param {object} res
   * @param {object} data
   * @returns {object} Success
   */
  static success(res: Response, data: Object) {
    return res.status(200).json(data);
  }

  /**
   * @description - bad request
   * @param {object} res
   * @param {object} data
   * @returns {object} Error
   */
  static badRequest(res: Response, data: Object) {
    return res.status(400).json(data);
  }

  /**
   * @description - Internal server error response
   * @param {object} res
   * @param {object} data
   * @returns {object} Error
   */
  static internalServerError(res: Response, data: Object) {
    return res.status(500).json(data);
  }
  /**
   * @description - unprocessableEntity error response
   * @param {object} res
   * @param {object} data
   * @returns {object} Error
   */
  static unprocessableEntity(res: Response, data: Object) {
    return res.status(422).json(data);
  }

  /**
   * @description - Unauthorized credentials
   * @param {object} res
   * @param {object} data
   * @returns {object} Unauthorized
   */
  static unauthorized(res: Response, data: Object) {
    return res.status(401).json(data);
  }

  /**
   * @description - Not found response
   * @param {object} res
   * @param {object} data
   * @returns {object} Not found
   */
  static notfound(res: Response, data: Object) {
    return res.status(404).json(data);
  }

  /**
   * @description - forbidden credentials
   * @param {object} res
   * @param {object} data
   * @returns {object} forbidden
   */
  static forbidden(res: Response, data: Object) {
    return res.status(403).json(data);
  }
}

export default StatusResponse;
