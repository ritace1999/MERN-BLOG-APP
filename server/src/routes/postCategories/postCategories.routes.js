import express from "express";
import PostCategoriesController from "../../controllers/postCategories.controller.js";

const router = express.Router();

router.get("/", PostCategoriesController.read);
router.post("/", PostCategoriesController.create);
router.put("/:id", PostCategoriesController.update);
router.delete("/:id", PostCategoriesController.delete);

export default router;
