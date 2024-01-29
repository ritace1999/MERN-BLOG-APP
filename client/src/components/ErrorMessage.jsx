import { TbFaceIdError } from "react-icons/tb";

const ErrorMessage = ({ message }) => {
  return (
    <div className=" flex w-full gap-2 justify-center items-center rounded-md bg-red-200 text-gray-900 mx-auto px-4 py-2 max-w-md">
      <TbFaceIdError className="text-4xl" />
      <p className="text-center italic font-bold">{message}</p>
    </div>
  );
};

export default ErrorMessage;
