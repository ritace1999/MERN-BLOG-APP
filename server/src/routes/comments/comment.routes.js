import express from "express";
import CommentController from "../../controllers/comment.controller.js";

const router = express.Router();

// Use a POST request for creating a new post
router.get("/", CommentController.read);
router.post("/", CommentController.create);
router.put("/:commentId", CommentController.update);
router.delete("/:commentId", CommentController.delete);

export default router;
