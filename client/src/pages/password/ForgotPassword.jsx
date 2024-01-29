import { useState } from "react";
import styles from "../../styles/form.module.css";

import toast from "react-hot-toast"; // Import toast
import { forgotPassword } from "../../services/index/users";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setIsSubmitting(true);

      // Call the forgotPassword API service
      await forgotPassword(email);

      toast.success("Email sent successfully!");
    } catch (error) {
      // Handle error (display error message to the user)
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[90%] md:w-[60%] lg:w-[30%] overflow-x-hidden mx-auto my-20 p-4 border rounded-lg shadow-2xl shadow-blue-500/60 bg-white">
      <h2 className="text-2xl text-center font-semibold mb-4">
        Recover Password
      </h2>
      <p className="font-semibold text-center">
        Enter your email to recover your password
      </p>

      <div className={`${styles.input_group} my-5`}>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${styles.input_text}`}
        />
      </div>

      <button
        onClick={handleForgotPassword}
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending Email..." : "Send Email"}
      </button>
    </div>
  );
};

export default ForgotPassword;
