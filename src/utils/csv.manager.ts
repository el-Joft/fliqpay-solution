import { Response } from "express";
import { ISupport } from "../support/support.interface";
const { Parser } = require("json2csv");

export default class CsvManager {
  /**
   *
   * @function
   * This function generates csv
   * @param user {User}.
   * @return {String}
   */

  public static generateCsv(
    response: Response,
    dataToGenerate: ISupport[],
    fileName: string
  ) {
    const csvHeaders = [
      "_id",
      "comments",
      "status",
      "description",
      "owner",
      "createdAt"
    ];
    const json2csv = new Parser({ csvHeaders });
    const csv = json2csv.parse(dataToGenerate);

    response.header("Content-Type", "text/csv");
    response.header(
      "Content-Disposition",
      `attachment;filename=${fileName}.csv`
    );
    response.attachment(fileName);
    return response.status(200).send(csv);
  }
}
