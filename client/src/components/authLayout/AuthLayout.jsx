import { images } from "../../constants";

export default function Layout({ children }) {
  return (
    <div className="flex h-auto">
      <div className="md:mt-8 mx-auto shadow-2xl shadow-blue-500/60 bg-slate-50  rounded-md w-[90%] md:w-[500px] lg:w-[75%] h-[85%] lg:grid lg:grid-cols-2">
        <div className="overflow-hidden md:bg-gradient-to-r from-blue-500 to-indigo-500 rounded-l-md">
          <img
            src={images.AuthImg}
            className=" hidden lg:block md:h-full md:w-full cursor-pointer "
          />
        </div>
        <div>
          <div className="text-center py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
