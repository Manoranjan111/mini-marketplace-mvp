import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  removeAllSessions,
  removeSession,
} from "../controllers/auth.controller";
import isAuthorized from "../middlewares/is-auth.middleware";
import { loginSchema } from "../entity/auth.entity";
import VerifySchema from "../middlewares/verify-zod-schema.middleware";

const router = express.Router();

router.route("/").post(VerifySchema(loginSchema), loginUser);
router.route("/refresh-token").post(refreshToken);

router.use(isAuthorized);

router.route("/").get(getCurrentUser);
router.route("/").get(getCurrentUser);
router.route("/").get(getCurrentUser);
router.route("/logout").get(logoutUser);

router.route("/session").delete(removeAllSessions);
router.route("/session/:sessionId").delete(removeSession);
export default router;
