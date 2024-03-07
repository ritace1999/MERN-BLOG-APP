import express from "express";
import UsersControllers from "../../controllers/users.controllers.js";

const router = express.Router();

router.get("/", UsersControllers.read);
router.delete("/delete/:id", UsersControllers.delete);

export default router;
