import { useState, useEffect } from "react";
import Layout from "../../components/authLayout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/form.module.css";
import { HiEnvelope, HiFingerPrint, HiUser } from "react-icons/hi2";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { registerValidate } from "../../lib/AuthValidation";
import { registerUser } from "../../services/index/users";
import zxcvbn from "zxcvbn";
import { useDispatch } from "react-redux";

function Register() {
  const [show, setShow] = useState({ password: false, cpassword: false });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validate: registerValidate,
    onSubmit: async (values) => {
      try {
        await registerUser(values);
        toast.success("Verify Your Email.");
        navigate(`/otp?email=${values.email}`);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  function onChange(value) {
    setVerified(true);
  }

  useEffect(() => {
    const result = zxcvbn(formik.values.password);
    setPasswordStrength(result.score);
  }, [formik.values.password]);

  const getPasswordStrengthLabel = (strength) => {
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

  return (
    <Layout>
      <section className="mx-auto flex w-3/4 flex-col gap-2">
        <div className="title">
          <h1 className="text-grey-800 font bold py-4 text-4xl">
            Register Here
          </h1>
        </div>
        {/* form*/}
        <form
          className="container flex flex-col gap-4"
          onSubmit={formik.handleSubmit}
        >
          <div
            className={`${styles.input_group} ${
              formik.errors.name && formik.touched.name ? "border-rose-500" : ""
            }`}
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className={styles.input_text}
              {...formik.getFieldProps("name")}
            />
            <span className="icon flex items-center px-4">
              <HiUser size={20} />
            </span>
          </div>

          <div
            className={`${styles.input_group} ${
              formik.errors.email && formik.touched.email
                ? "border-rose-500"
                : ""
            }`}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input_text}
              {...formik.getFieldProps("email")}
            />
            <span className="icon flex items-center px-4">
              <HiEnvelope size={20} />
            </span>
          </div>

          <div className="relative">
            <div
              className={`${styles.input_group} ${
                formik.errors.password && formik.touched.password
                  ? "border-rose-500"
                  : ""
              }`}
            >
              <input
                type={`${show.password ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                className={styles.input_text}
                {...formik.getFieldProps("password")}
              />
              <span
                onClick={() => setShow({ ...show, password: !show.password })}
                className="icon flex cursor-pointer items-center px-4	"
              >
                <HiFingerPrint size={20} />
              </span>
            </div>
            {formik.values.password && (
              <div className="absolute bottom-0 h-2 w-full">
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
          {formik.values.password && (
            <div className="mt-2 text-sm">
              Password Strength: {getPasswordStrengthLabel(passwordStrength)}
            </div>
          )}
          <div
            className={`${styles.input_group} ${
              formik.errors.cpassword && formik.touched.cpassword
                ? "border-rose-500"
                : ""
            }`}
          >
            <input
              type={`${show.cpassword ? "text" : "password"}`}
              name="cpassword"
              placeholder="Confirm Password"
              className={styles.input_text}
              {...formik.getFieldProps("cpassword")}
            />
            <span
              onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
              className="icon flex cursor-pointer items-center px-4	"
            >
              <HiFingerPrint size={20} />
            </span>
          </div>
          {formik.errors.name && formik.touched.name ? (
            <span className="text-rose-500">{formik.errors.name}</span>
          ) : formik.errors.email && formik.touched.email ? (
            <span className="text-rose-500">{formik.errors.email}</span>
          ) : formik.errors.password && formik.touched.password ? (
            <span className="text-rose-500">{formik.errors.password}</span>
          ) : formik.errors.cpassword && formik.touched.cpassword ? (
            <span className="text-rose-500">{formik.errors.cpassword}</span>
          ) : (
            <></>
          )}

          <div className="input_button">
            <button className={`${styles.button} mt-2`} type="submit">
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-dark-light">
          Already have an account?{" "}
          <Link className="text-blue-500 hover:text-blue-700" to={"/login"}>
            Login Here.
          </Link>
        </p>
      </section>
    </Layout>
  );
}

export default Register;
