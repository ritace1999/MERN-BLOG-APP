import React, { useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineCamera } from "react-icons/hi2";
import CropEasy from "./cropImage/CropEasy";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteAvatar, updateProfilePic } from "../services/index/apiService";
import { useMutation } from "@tanstack/react-query";

// Import your userActions file
import { userActions } from "../store/reducers/userReducer";

const ProfilePicture = ({ avatar }) => {
  const userState = useSelector((state) => state.user);
  const imageUrl = avatar ? `http://localhost:4000/uploads/${avatar}` : "";
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePic({
        token: token,
        formData: formData,
      });
    },
    onError: (error) => {
      toast.error("Failed to update profile . Please try again.");
      console.error(error);
    },
    onSuccess: (data, variables, context) => {
      // Get the existing data from local storage
      const existingData = JSON.parse(localStorage.getItem("account")) || {};

      // Merge the new data with the existing data
      const updatedData = { ...existingData, ...data };

      // Update local storage with the merged data
      localStorage.setItem("account", JSON.stringify(updatedData));

      // Dispatch and show success toast
      dispatch(userActions.setUserInfo(updatedData));
      toast.success("Profile updated successfully");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto({ url: file ? URL.createObjectURL(file) : null, file });
    setOpenCrop(true);
  };

  const handleDeleteAvatar = async () => {
    try {
      // Trigger the deletion using the user's token
      const result = await deleteAvatar(userState.userInfo.token);

      // Check if there is a specific server error message
      if (result.msg) {
        // Include the server error message in the toast
        toast.error(result.msg);
      } else {
        // Optionally, update local storage/Redux state if needed for success
        // (Note: It seems this logic is missing in your original code)

        // Handle success
        toast.success(result.data.msg);
      }
    } catch (error) {
      // If an error occurs during the deletion request
      toast.error(error.msg);
      console.error(error);
    }
  };

  return (
    <>
      {openCrop &&
        createPortal(
          <CropEasy photo={photo} setOpenCrop={setOpenCrop} />,
          document.getElementById("portal")
        )}

      <div className="w-full flex items-center justify-center my-4 gap-x-5">
        <div className="relative w-16 h-16 rounded-full outline outline-offset-2 outline-w outline-primary overflow-hidden">
          <label
            htmlFor="profilePicture"
            className="cursor-pointer inset-0 rounded-full bg-transparent"
          >
            {avatar ? (
              <img
                src={imageUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-50 flex justify-center items-center">
                <HiOutlineCamera className="w-7 h-auto text-primary" />
              </div>
            )}
          </label>
          <input
            type="file"
            className="sr-only"
            id="profilePicture"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleDeleteAvatar}
          type="button"
          className="border border-red-500 rounded-lg px-4 py-2 text-red-500"
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default ProfilePicture;
