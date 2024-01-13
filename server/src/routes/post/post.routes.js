import express from "express";
import PostController from "../../controllers/post.controller.js";
// import { adminCheck } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Use a POST request for creating a new post

router.get("/", PostController.read);
router.get("/:slug", PostController.readBySlug);
router.post("/", PostController.createPost);
router.put("/:slug", PostController.update);
router.delete("/:slug", PostController.deletePost);

export default router;
