import { uploadPic } from "../middleware/upload.profile.js";
import { fileRemover } from "../utils/fileRemover.js";

import User from "../models/user.model.js";

class ProfileController {
  user = async (req, res, next) => {
    try {
      const user = req.user;

      res.json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } catch (error) {
      next({
        msg: "Unable to fulfill request at this moment",
        status: 500,
      });
    }
  };
  update = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const userId = req.user._id;

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return next({
          msg: "User not found",
          status: 404,
        });
      }

      // Update profile details if provided
      if (name) {
        user.name = name;
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        // Check if the current password matches the user's stored password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return next({
            msg: "Current password is incorrect",
            status: 400,
          });
        }

        // Update the user's password with the new password
        user.password = newPassword;
      }

      // Save the updated user document
      await user.save();

      // Fetch the updated user to include in the response
      const updatedUser = await User.findById(userId);

      res.json({
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
        name: updatedUser.name,
        email: updatedUser.email,
        verified: updatedUser.verified,
        admin: updatedUser.admin,
        message: "Profile updated successfully",
      });
    } catch (error) {
      next({
        msg: "Unable to update profile",
        status: 500,
      });
    }
  };

  updateProfilePic = async (req, res, next) => {
    try {
      // Use the uploadPic middleware to handle the file upload
      uploadPic.single("profilePic")(req, res, async function (err) {
        if (err) {
          // Handle the upload error
          const error = new Error("An unknown error occurred when uploading");
          next(error);
        } else {
          if (req.file) {
            let filename;
            let updatedUser = await User.findById(req.user._id);
            filename = updatedUser.avatar;
            if (filename) {
              fileRemover(filename);
            }
            updatedUser.avatar = req.file.filename;
            await updatedUser.save();
            res.json({
              _id: updatedUser._id,
              avatar: updatedUser.avatar,
              name: updatedUser.name,
              email: updatedUser.email,
              verified: updatedUser.verified,
              admin: updatedUser.admin,
            });
          } else {
            let filename;
            let updatedUser = await User.findById(req.user._id);
            filename = updatedUser.avatar;
            updatedUser.avatar = "";
            await updatedUser.save();
            fileRemover(filename);
            res.json({
              _id: updatedUser._id,
              avatar: updatedUser.avatar,
              name: updatedUser.name,
              email: updatedUser.email,
              verified: updatedUser.verified,
              admin: updatedUser.admin,
            });
          }
        }
      });
    } catch (error) {
      // Handle any other errors
      next({
        msg: "Unable to update profile Picture",
        status: 500,
      });
    }
  };
}

export default new ProfileController();
