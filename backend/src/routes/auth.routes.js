import express from "express";
import {
  register,
  login,
  verify2fa,
  me,
  requestReset,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify2fa", verify2fa);
router.get("/me", me);

// password reset
router.post("/request-reset", requestReset);
router.post("/reset-password", resetPassword);

export default router;
