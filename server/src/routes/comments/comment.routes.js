import express from "express";
import CommentController from "../../controllers/comment.controller.js";
import { authCheck } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Use a POST request for creating a new post
router.get("/", CommentController.read);
router.post("/", authCheck, CommentController.create);
router.put("/:commentId", authCheck, CommentController.update);
router.delete("/:commentId", authCheck, CommentController.delete);

export default router;
