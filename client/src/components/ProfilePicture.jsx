import { useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineCamera } from "react-icons/hi2";
import CropEasy from "./cropImage/CropEasy";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { deleteAvatar } from "../services/index/users";
import Confirmation from "./Confirmation";

const ProfilePicture = ({ avatar, refetch }) => {
  const userState = useSelector((state) => state.user);
  const imageUrl = avatar ? `http://localhost:4000/uploads/${avatar}` : "";
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto({ url: file ? URL.createObjectURL(file) : null, file });
    setOpenCrop(true);
  };

  const handleDeleteAvatar = () => {
    setConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteAvatar(userState.userInfo.token);

      if (result.msg) {
        toast.error(result.msg);
      } else {
        toast.success(result.data.msg);
        refetch();
      }
    } catch (error) {
      toast.error(error.msg);
      console.error(error);
    } finally {
      setConfirmationModal(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationModal(false);
  };

  return (
    <>
      {openCrop &&
        createPortal(
          <CropEasy
            refetch={refetch}
            photo={photo}
            setOpenCrop={setOpenCrop}
          />,
          document.getElementById("portal")
        )}

      {confirmationModal && (
        <Confirmation
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
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
          className="border text-white rounded-lg px-4 py-2 bg-red-500 hover:opacity-70"
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default ProfilePicture;
