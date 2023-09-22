import express from "express";
import authRoutes from "./auth/auth.routes.js";
import { authCheck } from "../middleware/authMiddleware.js";
import profileRoutes from "./profile/profile.routes.js";
const router = express.Router();

router.use(authRoutes);
router.use("/profile", authCheck, profileRoutes);
router.use((req, res, next) => {
  next({
    status: 404,
    msg: `Invalid method/URL ${req.method} ${req.path}`,
  });
});

export default router;
