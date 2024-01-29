import { useState, useEffect } from "react";
import Layout from "../../components/authLayout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/form.module.css";
import { HiEnvelope, HiFingerPrint } from "react-icons/hi2";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { loginValidate } from "../../lib/AuthValidation";
import { loginUser } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducer";

function LoginLayout() {
  const [show, setShow] = useState({ password: false });
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    const storedLoginAttempts =
      parseInt(localStorage.getItem(`loginAttempts_${userState.email}`)) || 0;
    const storedTimeoutEnd =
      parseInt(localStorage.getItem(`loginTimeoutEnd_${userState.email}`)) || 0;

    if (storedLoginAttempts >= 5 && storedTimeoutEnd > Date.now()) {
      const remainingTime = Math.ceil((storedTimeoutEnd - Date.now()) / 1000);
      setTimeLeft(remainingTime);

      setShowRemainingTime(true);

      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            localStorage.removeItem(`loginTimeoutEnd_${userState.email}`);
            setShowRemainingTime(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [userState.email]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidate,
    onSubmit: async (values) => {
      try {
        const storedTimeoutEnd =
          parseInt(localStorage.getItem(`loginTimeoutEnd_${values.email}`)) ||
          0;

        if (storedTimeoutEnd > Date.now()) {
          const remainingTime = Math.ceil(
            (storedTimeoutEnd - Date.now()) / 1000
          );

          setShowRemainingTime(true);
          setTimeLeft(remainingTime);

          toast.error(
            `Account temporarily locked. Please try again in ${remainingTime} seconds.`
          );
          return;
        }

        const userData = await loginUser(values);
        dispatch(userActions.setUserInfo(userData));
        localStorage.setItem("account", JSON.stringify(userData));

        // Reset login attempts and timeout
        localStorage.setItem(`loginAttempts_${values.email}`, "0");
        localStorage.removeItem(`loginTimeoutEnd_${values.email}`);

        navigate("/");
        toast.success("Logged In Successfully");
      } catch (error) {
        toast.error(error.message);

        const storedLoginAttempts =
          parseInt(localStorage.getItem(`loginAttempts_${values.email}`)) || 0;
        const loginAttempts = storedLoginAttempts + 1;
        localStorage.setItem(
          `loginAttempts_${values.email}`,
          loginAttempts.toString()
        );

        if (loginAttempts >= 5) {
          const timeoutEnd = Date.now() + timeLeft * 1000;
          localStorage.setItem(
            `loginTimeoutEnd_${values.email}`,
            timeoutEnd.toString()
          );

          setShowRemainingTime(true);

          const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
              if (prevTime <= 0) {
                clearInterval(interval);
                localStorage.removeItem(`loginTimeoutEnd_${values.email}`);
                setShowRemainingTime(false);
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
        }
      }
    },
  });

  return (
    <Layout className="container">
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          <h1 className="text-grey-800 text-4xl font bold py-4">Login Here</h1>
        </div>
        <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
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
              {" "}
              <HiEnvelope size={20} />
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
              type={`${show.password ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              className={styles.input_text}
              {...formik.getFieldProps("password")}
            />
            <span
              onClick={() =>
                setShow((prevShow) => ({
                  ...prevShow,
                  password: !prevShow.password,
                }))
              }
              className="flex items-center px-4 cursor-pointer"
            >
              <HiFingerPrint size={20} />
            </span>
          </div>

          {formik.errors.email && formik.touched.email ? (
            <span className="text-rose-500">{formik.errors.email}</span>
          ) : formik.errors.password && formik.touched.password ? (
            <span className="text-rose-500">{formik.errors.password}</span>
          ) : null}

          <div className="input_button">
            <button className={`${styles.button} mt-2`} type="submit">
              Login
            </button>
          </div>
        </form>
        {showRemainingTime && (
          <div className="text-center text-red-500">
            Account temporarily locked. Please try again in {timeLeft} seconds.
          </div>
        )}
        <p className="text-center text-dark-light">
          Don't have an account yet?
          <Link className="text-blue-500 hover:text-blue-700" to={"/register"}>
            Register Here.
          </Link>
        </p>
        <span>
          <Link className="text-blue-500 hover:text-blue-700" to={"/password"}>
            Forgot Password?
          </Link>
        </span>
      </section>
    </Layout>
  );
}

export default LoginLayout;
