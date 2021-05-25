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
      "title",
      "status",
      "description",
      "createdBy",
      "isAdmin"
    ];

    const newData: any[] = [];

    dataToGenerate.map(item => {
      const data = {
        id: item.id,
        title: item.title,
        status: item.status,
        description: item.description,
        createdBy: `${item.createdBy!.firstName} ${item.createdBy!.lastName}`,
        isAdmin: item.createdBy!.isAdmin
      };
      newData.push(data);
    });

    const json2csvParser = new Parser({ csvHeaders });
    const csv = json2csvParser.parse(newData);

    response.header("Content-Type", "text/csv");
    response.header(
      "Content-Disposition",
      `attachment;filename=${fileName}.csv`
    );
    response.attachment(fileName);
    return response.status(200).send(csv);
  }
}
