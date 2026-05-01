import { Router } from "express";
import * as authController from "./auth.controller.js";

import { validation } from "../../middleware/validation.middleware.js";
import { loginSchema } from "./auth.validation.js";

const router = Router();

router.post("/login", validation(loginSchema), authController.login);


export default router;
