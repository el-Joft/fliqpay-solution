import { connect, connection, Mongoose } from "mongoose";
import dotenv from "dotenv";
// import logger from "./logger";
import { dbConfig } from "./config.db";

dotenv.config();

const { MONGODB_URI, MONGODB_TEST_URI, NODE_ENV } = dbConfig;

const dbUrl: string = NODE_ENV === "test" ? MONGODB_TEST_URI : MONGODB_URI;

connection.on("connected", () => {
  console.log("Mongoose default connection is open");
});

connection.on("error", (err: Error) => {
  console.log(err.message, err.stack);
});

connection.on("disconnected", () => {
  console.log("Mongoose default connection is disconnected");
});

process.on("SIGINT", async () => {
  connection.close(() => {
    console.log(
      "Mongoose default connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

export default async () => (await connect(dbUrl, options)) as Mongoose;
