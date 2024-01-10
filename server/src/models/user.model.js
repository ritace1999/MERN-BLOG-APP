import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false }, 
    otp: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);
const User = model("users", UserSchema);
export default User;
