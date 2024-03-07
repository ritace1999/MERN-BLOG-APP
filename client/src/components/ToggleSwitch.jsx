import { useState } from "react";

const ToggleSwitch = ({ comment, mutateUpdateCommentCheck, userState }) => {
  const [isChecked, setIsChecked] = useState(comment?.check === "true");

  const handleToggle = () => {
    const newCheckedValue = !isChecked;
    setIsChecked(newCheckedValue);

    mutateUpdateCommentCheck({
      token: userState.userInfo.token,
      check: newCheckedValue.toString(),
      commentId: comment._id,
    });
  };
  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="peer sr-only opacity-0"
        id={`toggle-${comment._id}`}
      />
      <label
        htmlFor={`toggle-${comment._id}`}
        className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 outline-gray-400 transition-colors ${
          isChecked ? "bg-green-500" : "bg-gray-400"
        } before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500`}
      >
        <span className="sr-only">Enable</span>
      </label>
    </>
  );
};

export default ToggleSwitch;
