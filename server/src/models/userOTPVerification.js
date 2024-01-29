import { Schema, model } from "mongoose";
const UserOTPVerificationSchema = new Schema({
  userId: String,
  otp: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

const UserOTPVerification = model("OTPs", UserOTPVerificationSchema);

export default UserOTPVerification;
