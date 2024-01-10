import React, { useState, useEffect } from "react";
import { HiEnvelope, HiFingerPrint, HiUser } from "react-icons/hi2";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import styles from "../../styles/form.module.css";
import {
  getUserProfile,
  updateProfile,
  updatePassword,
} from "../../services/index/apiService";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/reducers/userReducer";
import ProfilePicture from "../../components/ProfilePicture";

function ProfileLayout() {
  const [show, setShow] = useState({ opassword: false, password: false });

  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user);

  // Fetch user profile data using the useQuery hook
  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
  } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: userState.userInfo.token });
    },
    queryKey: ["profile"],
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      opassword: "",
      password: "",
    },

    onSubmit: async (values) => {
      const { name, email, token } = values;
      updateProfileMutation({ name, email, token });
    },
  });

  const { mutate: updateProfileMutation, isLoading: updateProfileLoading } =
    useMutation({
      mutationFn: ({ name, email }) => {
        return updateProfile({
          token: userState.userInfo.token,
          userData: { name, email },
        });
      },
      onSuccess: (data) => {
        const existingData = JSON.parse(localStorage.getItem("account")) || {};
        const updatedData = { ...existingData, ...data };
        localStorage.setItem("account", JSON.stringify(updatedData));
        dispatch(userActions.setUserInfo(updatedData));
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updatePasswordMutation, isLoading: updatePasswordLoading } =
    useMutation({
      mutationFn: ({ opassword, password }) => {
        return updatePassword({
          token: userState.userInfo.token,
          userData: { opassword, password },
        });
      },
      onSuccess: () => {
        toast.success("Password updated successfully");
        formik.setValues({ ...formik.values, opassword: "", password: "" });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  useEffect(() => {
    if (!profileIsLoading && profileData) {
      formik.setValues({
        name: profileData.name || "",
        email: profileData.email || "",
        opassword: "",
        password: "",
      });
    }
  }, [profileIsLoading, profileData]);

  return (
    <div className="flex h-auto">
      <div className="md:mt-8 mx-auto shadow-2xl shadow-blue-500/60 bg-slate-50  rounded-md w-[90%] md:w-[75%] lg:w-[65%]  md:h-[85%] ">
        <div>
          <div className="text-center py-6">
            <section className="w-[90%] mx-auto flex flex-col gap-2 md:w-[65%] lg:w-[50%]">
              <div className="title">
                <h1 className="text-grey-800 text-2xl font bold py-4">
                  Edit Your Profile
                </h1>
              </div>
              <ProfilePicture avatar={profileData?.avatar} />
              <form
                className="flex flex-col gap-4 container"
                onSubmit={formik.handleSubmit}
              >
                <div className={`${styles.input_group} `}>
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

                <div className={`${styles.input_group} `}>
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

                <div className={`${styles.input_group} `}>
                  <input
                    type={`${show.opassword ? "text" : "password"}`}
                    name="opassword"
                    placeholder="Old Password"
                    className={styles.input_text}
                    {...formik.getFieldProps("opassword")}
                  />
                  <span
                    onClick={() =>
                      setShow({ ...show, opassword: !show.opassword })
                    }
                    className="icon flex items-center px-4 cursor-pointer	"
                  >
                    <HiFingerPrint size={20} />
                  </span>
                </div>

                <div className={`${styles.input_group} `}>
                  <input
                    type={`${show.password ? "text" : "password"}`}
                    name="password"
                    placeholder="New Password"
                    className={styles.input_text}
                    {...formik.getFieldProps("password")}
                  />
                  <span
                    onClick={() =>
                      setShow({ ...show, password: !show.password })
                    }
                    className="icon flex items-center px-4 cursor-pointer	"
                  >
                    <HiFingerPrint size={20} />
                  </span>
                </div>

                <div className="input_button">
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => updatePasswordMutation(formik.values)}
                  >
                    {updatePasswordLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>

                <div className="input_button">
                  <button className={styles.button} type="submit">
                    {updateProfileLoading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
