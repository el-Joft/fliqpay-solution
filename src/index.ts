import * as http from "http";
// import * as debug from "debug";
import { AddressInfo } from "net";

import app from "./app";
import { dbConfig } from "./config/config.db";

// debug("ts-app:server");

const app_port = dbConfig.PORT || 8080;
const port = normalizePort(app_port);

app.set("port", port);

function normalizePort(val: number | string): number | string | boolean {
  let port: number = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;
  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    case "ECONNREFUSED":
      console.error(error);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = server.address() as AddressInfo;
  let bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
const server = http.createServer(app);

server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

export default server;
