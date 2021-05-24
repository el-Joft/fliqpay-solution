import { Router, Application } from "express";

import HomeRoute from "./common";
import authenticationRouter from "../authentication";
import supportRouter from "../support";
import commentRouter from "../comment";

const routes: Router[] = [authenticationRouter, supportRouter, commentRouter];

const urlPrefix: string = `/api/v1`;

export default (app: Application): Application => {
  app.use(HomeRoute);
  routes.forEach((route: Router) => app.use(urlPrefix, route));
  return app;
};
