import express from "express";
import ProfileController from "../../controllers/profile.controller.js";
const router = express.Router();

router.get("/user", ProfileController.user);
router.put("/edit", ProfileController.update);
router.put("/editProfilePicture", ProfileController.updateProfilePic);

export default router;
