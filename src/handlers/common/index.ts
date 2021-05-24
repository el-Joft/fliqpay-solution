import { Router } from "express";

import HomeRoute from "./Home";

const router: Router = Router();

router.get("/", HomeRoute.getHome);

export default router;
