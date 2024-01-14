import express from "express";
import authRoutes from "./auth/auth.routes.js";
import { adminCheck, authCheck } from "../middleware/authMiddleware.js";
import profileRoutes from "./profile/profile.routes.js";
import postRoutes from "./post/post.routes.js";
import commentRoutes from "./comments/comment.routes.js";
import postCategories from "./postCategories/postCategories.routes.js";
import { routesErr } from "../middleware/errorMiddleware.js";
const router = express.Router();

router.use(authRoutes);
router.use("/profile", authCheck, profileRoutes);
router.use("/posts", postRoutes);
router.use("/comments", authCheck, commentRoutes);
router.use("/categories", authCheck, adminCheck, postCategories);

router.use(routesErr);

export default router;
