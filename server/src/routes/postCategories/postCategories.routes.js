import express from "express";
import PostCategoriesController from "../../controllers/postCategories.controller.js";
import { adminCheck, authCheck } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", PostCategoriesController.read);
router.get("/:categoryId", PostCategoriesController.readById);
router.post("/", authCheck, adminCheck, PostCategoriesController.create);
router.put(
  "/:categoryId",
  authCheck,
  adminCheck,
  PostCategoriesController.update
);
router.delete(
  "/:categoryId",
  authCheck,
  adminCheck,
  PostCategoriesController.delete
);

export default router;
