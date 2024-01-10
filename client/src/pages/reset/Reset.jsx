import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { HiFingerPrint } from "react-icons/hi";
import styles from "../../styles/form.module.css";
import { resetPasswordValidate } from "../../lib/AuthValidation";
import { resetPassword } from "../../services/index/apiService";
import { MainLayout } from "../../components/MainLayout";
import { useMutation } from "@tanstack/react-query";
import zxcvbn from "zxcvbn";

function ResetPassword() {
  const [show, setShow] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { token } = useParams();

  const { mutate: resetPasswordMutation } = useMutation(
    ["resetPassword", { token }],
    async ({ token, password }) => {
      const response = await resetPassword(token, password);
      return response;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        if (data.success == false) {
          toast.error(data.msg || "An error occurred");
        } else {
          toast.success(data.msg);
          navigate("/login");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: resetPasswordValidate,
    onSubmit: async (values) => {
      resetPasswordMutation({ token, password: values.password });
    },
  });

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-500";
      default:
        return "";
    }
  };

  const passwordStrengthLabel = () => {
    const strength = zxcvbn(formik.values.password).score;
    switch (strength) {
      case 0:
        return "Weak";
      case 1:
        return "Fair";
      case 2:
        return "Good";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  useEffect(() => {
    const result = zxcvbn(formik.values.password);
    setPasswordStrength(result.score);
  }, [formik.values.password]);
  return (
    <MainLayout>
      <div className="w-[90%] text-center md:w-[60%] lg:w-[30%] overflow-x-hidden mx-auto my-20 p-4 border rounded-lg shadow-2xl shadow-blue-500/60 bg-white">
        <section className=" mx-auto flex flex-col gap-5">
          <h1 className="text-grey-800 text-4xl font-bold py-2">
            Reset Password
          </h1>

          <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
            <div
              className={`relative ${styles.input_group} ${
                formik.errors.password && formik.touched.password
                  ? "border-rose-500"
                  : ""
              }`}
            >
              <input
                type={`${show.password ? "text" : "password"}`}
                name="password"
                placeholder="New Password"
                className={styles.input_text}
                {...formik.getFieldProps("password")}
              />
              <span
                onClick={() => setShow({ ...show, password: !show.password })}
                className="flex items-center px-4 cursor-pointer"
              >
                <HiFingerPrint size={20} />
              </span>

              {/* Password strength bar */}
              {formik.values.password && (
                <div className="absolute my-[49px] w-full h-2">
                  <div
                    className={`h-full ${getPasswordStrengthColor(
                      passwordStrength
                    )}`}
                    style={{
                      width: `${(passwordStrength + 1) * 20}%`,
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Password strength label */}
            {formik.values.password && (
              <div className="text-sm ">
                Password Strength: {passwordStrengthLabel()}
              </div>
            )}

            <div
              className={`${styles.input_group} ${
                formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? "border-rose-500"
                  : ""
              }`}
            >
              <input
                type={`${show.confirmPassword ? "text" : "password"}`}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.input_text}
                {...formik.getFieldProps("confirmPassword")}
              />
              <span
                onClick={() =>
                  setShow({ ...show, confirmPassword: !show.confirmPassword })
                }
                className=" flex items-center px-4 cursor-pointer"
              >
                <HiFingerPrint size={20} />
              </span>
            </div>
            {formik.errors.password && formik.touched.password ? (
              <span className="text-rose-500">{formik.errors.password}</span>
            ) : formik.errors.confirmPassword &&
              formik.touched.confirmPassword ? (
              <span className="text-rose-500">
                {formik.errors.confirmPassword}
              </span>
            ) : (
              <></>
            )}

            {/* Confirm password error */}

            <button className={`${styles.button} mb-5`} type="submit">
              Reset Password
            </button>
          </form>
        </section>
      </div>
    </MainLayout>
  );
}

export default ResetPassword;
