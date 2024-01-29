// OTPPage.js

import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../../styles/form.module.css";
import toast from "react-hot-toast"; // Import toast
import { MainLayout } from "../../components/MainLayout";
import { verifyOTP } from "../../services/index/users";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";
  const navigate = useNavigate(); // Use useNavigate hook to programmatically navigate

  const handleChange = (index, value) => {
    if (!isNaN(value)) {
      const newOtp = [...otp];

      // Clear the existing value at the specified index
      newOtp[index] = "";

      // Set the new value at the specified index
      newOtp[index] = value;

      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        // Move focus to the next input
        document.getElementById(`otp-input-${index + 1}`).focus();
      } else if (value === "" && index > 0) {
        // Move focus to the previous input when backspace is pressed
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "ArrowLeft" && index > 0) {
      // Handle left arrow to move to the previous input
      e.preventDefault();
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (
      e.key === "ArrowRight" &&
      index < otp.length - 1 &&
      otp[index] !== ""
    ) {
      // Handle right arrow to move to the next input if there is input
      e.preventDefault();
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleVerification = async () => {
    try {
      const enteredOTP = otp.join("");
      const verificationResponse = await verifyOTP(email, enteredOTP);

      if (verificationResponse.verified) {
        toast.success("Email Verified. Redirecting to login...");
        // Redirect to login page after successful OTP verification
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Error verifying OTP");
    }
  };
  return (
    <MainLayout>
      <div className="flex h-full w-full">
        <div className="my-8 mx-auto shadow-2xl shadow-blue-500/60 bg-slate-50  rounded-md w-[95%] md:w-[60%] lg:w-[30%] h-[230px]  ">
          <div className=" flex flex-col justify-center items-center text-center py-6 ">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Enter OTP to verify email
            </h2>
            <div className=" space-x-2 ">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-3xl border rounded-md text-center focus:outline-none shadow-sm shadow-blue-500/60 "
                />
              ))}
            </div>
            <button
              onClick={handleVerification}
              className={`${styles.button} my-6 w-[50%] `}
              type="submit"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OTPPage;
