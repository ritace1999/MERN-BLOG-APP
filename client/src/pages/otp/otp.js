// OTPPage.js

import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../../styles/form.module.css";
import Layout from "../../components/authLayout/AuthLayout";
import toast from "react-hot-toast"; // Import toast

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";
  const navigate = useNavigate(); // Use useNavigate hook to programmatically navigate

  const handleChange = (index, value) => {
    if (!isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleVerification = async () => {
    try {
      const enteredOTP = otp.join("");
      const response = await axios.post("http://localhost:4000/verify-otp", {
        email,
        otp: enteredOTP,
      });

      if (response.data.verified) {
        toast.success("OTP verification successful. Redirecting to login...");
        // Redirect to login page after successful OTP verification
        navigate("/login");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during OTP verification.");
    }
  };

  return (
    <div className="flex h-auto">
      <div className="md:mt-8 mx-auto shadow-2xl shadow-blue-500/60 bg-slate-50  rounded-md w-[90%] lg:w-[70%] h-[85%] md:h-[80%] md:grid md:grid-cols-2">
        <div className="overflow-hidden md:bg-gradient-to-r from-blue-500 to-indigo-500 rounded-l-md">
          <img
            src={images.AuthImg}
            className=" hidden md:block md:h-full md:w-full cursor-pointer "
          />
        </div>
        <div>
          <div className="text-center py-6">
            <div className="flex space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-12 h-12 text-3xl border rounded-md text-center focus:outline-none focus:border-blue-500"
                />
              ))}
            </div>
            <button
              onClick={handleVerification}
              className={`${styles.button} mt-2 w-[100px] h-[40px] flex justify-center items-center `}
              type="submit"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
