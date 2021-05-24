import { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import dbConnection from "./config/db_connection";
import handlers from "./handlers";
// import seedData from "./database/seeders/seeder";

class App {
  public app: Application;
  public PORT = process.env.PORT;

  constructor() {
    this.app = express();
    this.setConfig();
    this.dbhandler();
  }

  private setConfig(): void {
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({}));
    // Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ extended: true }));
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }
    // Enables cors
    this.app.use(cors());

    handlers(this.app);

    // catch all routers
    this.app.use(
      "*",
      (request: Request, response: Response): Response => {
        return response.status(404).json({
          message: "Route not found, Kindly check the documentation"
        });
      }
    );
  }
  private async dbhandler(): Promise<void> {
    dbConnection().then(async () => {
      if (process.env.NODE_ENV !== "test") {
        // await seedData();
      }
      if (!module.parent) {
        this.app.listen(this.PORT, () => {
          console.log(
            `Server running on ${
              process.env.NODE_ENV
            } environment, on port ${this.PORT || 5000}`
          );
        });
      }
    });
  }
}

export default new App().app;
