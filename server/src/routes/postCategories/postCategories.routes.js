import express from "express";
import PostCategoriesController from "../../controllers/postCategories.controller.js";
import { adminCheck, authCheck } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", PostCategoriesController.read);
router.post("/", authCheck, adminCheck, PostCategoriesController.create);
router.put("/:id", authCheck, adminCheck, PostCategoriesController.update);
router.delete("/:id", authCheck, adminCheck, PostCategoriesController.delete);

export default router;
