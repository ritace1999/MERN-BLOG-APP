import React, { useState } from "react";

import Layout from "../../components/authLayout/AuthLayout";
import { Link } from "react-router-dom";
import styles from "../../styles/form.module.css";
import { HiEnvelope, HiFingerPrint } from "react-icons/hi2";
import { useFormik } from "formik";
import { loginValidate } from "../../lib/AuthValidation";
function LoginLayout() {
  const [show, setShow] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidate,
    onSubmit,
  });
  async function onSubmit(value) {
    console.log(value);
  }
  return (
    //  {/*Title*/}
    <Layout className=" container">
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          <h1 className="text-grey-800 text-4xl font bold py-4">Login Here</h1>
        </div>
        {/* form*/}
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
              formik.errors.password && formik.touched.password
                ? "border-rose-500"
                : ""
            }`}
          >
            <input
              type={`${show ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              className={styles.input_text}
              {...formik.getFieldProps("password")}
            />
            <span
              onClick={() => setShow(!show)}
              className="icon flex items-center px-4 cursor-pointer	"
            >
              {" "}
              <HiFingerPrint size={20} />
            </span>
          </div>

          {formik.errors.email && formik.touched.email ? (
            <span className="text-rose-500">{formik.errors.email}</span>
          ) : formik.errors.password && formik.touched.password ? (
            <span className="text-rose-500">{formik.errors.password}</span>
          ) : (
            <></>
          )}

          <div className="input_button">
            <button className={styles.button} type="submit">
              Login
            </button>
          </div>
        </form>
        {/* bottom*/}
        <p className="text-center text-dark-light">
          Don't have an account yet?
          <Link className="text-blue-500 hover:text-blue-700" to={"/register"}>
            Register Here.
          </Link>
        </p>
        <span>
          <Link
            className="text-blue-500 hover:text-blue-700"
            to={"/forget-password"}
          >
            Forget Password?
          </Link>
        </span>
      </section>
    </Layout>
  );
}

export default LoginLayout;
