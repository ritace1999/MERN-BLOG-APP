import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import crypto from "crypto";
import UserOTPVerification from "../models/userOTPVerification.js";

class AuthController {
  // Send OTP via email
  sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "blogapp97@gmail.com",
        pass: "suon ngbt bciv ttkn",
      },
    });

    const mailOptions = {
      from: "blogapp97@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  };

  // User login method
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          msg: "User not found",
        });
      }

      // Check if the provided password matches the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          msg: "Invalid password",
        });
      }

      // If email and password are correct, generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "30d",
      });

      // Respond with user information and token
      return res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        superAdmin: user.superAdmin,
        token: token,
      });
    } catch (err) {
      console.error(err);
      next({
        msg: "Unable to login at this moment",
        status: 500,
      });
    }
  };

  // User registration with OTP
  registerWithOTP = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          msg: "User already registered",
        });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Save OTP in database
      await UserOTPVerification.create({
        userId: newUser._id,
        otp: otp.toString(),
        expiresAt,
      });

      // Send OTP via email
      await this.sendOTP(email, otp);

      // Generate JWT token for the user
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY, {
        expiresIn: "30d",
      });

      // Respond with user information and token
      return res.status(201).json({
        _id: newUser._id,
        avatar: newUser.avatar,
        name: newUser.name,
        email: newUser.email,
        verified: newUser.verified,
        admin: newUser.admin,
        token: token,
      });
    } catch (err) {
      console.error(err);
      next({
        msg: "Unable to register at this moment",
        status: 500,
      });
    }
  };

  // Verify OTP and log in the user
  // Verify OTP and log in the user
  verifyOTP = async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          msg: "User not found",
        });
      }

      // Find the latest OTP for the user
      const latestOTP = await UserOTPVerification.findOne({
        userId: user._id,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      // Check if the OTP is valid
      if (!latestOTP || latestOTP.otp !== otp) {
        return res.status(401).json({
          msg: "Invalid OTP",
        });
      }

      // Clear OTP data
      await UserOTPVerification.deleteMany({ userId: user._id });

      // Update user's verified status
      await User.updateOne({ _id: user._id }, { verified: true });

      // Generate JWT token for the user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "30d",
      });

      // Respond with user information and token
      return res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: true, // Updated status
        admin: user.admin,
        token: token,
      });
    } catch (err) {
      console.error(err);
      next({
        msg: "Unable to verify OTP at this moment",
        status: 500,
      });
    }
  };

  forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

      await user.save();

      await this.sendResetEmail(user.email, resetToken);

      res.json({ message: "Email sent with reset instructions" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Reset Password: Update password based on token
  resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findOne({
        resetToken: token,
      });

      if (!user) {
        return res.status(400).json({ msg: "Invalid or expired token" });
      }

      // Check if the new password is the same as the old password
      const isSamePassword = await bcrypt.compare(password, user.password);

      if (isSamePassword) {
        return res
          .status(400)
          .json({ msg: "New password cannot be the same as the old password" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;

      await user.save();

      // Sending a response here instead of at the end
      return res.json({ msg: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      // Sending an error response in case of an exception
      return res.status(500).json({ msg: "Unable to reset password" });
    }
  };

  // Send Reset Email
  sendResetEmail = async (email, resetToken) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "blogapp97@gmail.com",
        pass: "suon ngbt bciv ttkn",
      },
    });

    const mailOptions = {
      to: email,
      from: "blogapp97@gmail.com",
      subject: "Password Reset",
      text: `
      You are receiving this email because you requested a password reset.
      Click the following link to reset your password:
      http://localhost:5173/reset-password/${resetToken}
    `,
    };

    await transporter.sendMail(mailOptions);
  };
}

export default new AuthController();
