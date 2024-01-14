import express from "express";
import PostController from "../../controllers/post.controller.js";
import { authCheck, adminCheck } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", PostController.read);
router.get("/:slug", PostController.readBySlug);
router.post("/", authCheck, adminCheck, PostController.createPost);
router.put("/:slug", authCheck, adminCheck, PostController.update);
router.delete("/:slug", authCheck, adminCheck, PostController.deletePost);

export default router;
