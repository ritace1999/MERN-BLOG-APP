import { images, stables } from "../constants";
import { Link } from "react-router-dom";
import { BiCheck } from "react-icons/bi";
import { MdOutlineNotInterested } from "react-icons/md";

export const ArticleCard = ({ post, className }) => {
  return (
    <div
      className={`rounded-xl md:ml-[8px] lg:ml-[8px] overflow-hidden shadow-2xl shadow-blue-500/60 } ${className} `}
    >
      <Link to={`/blog/${post.slug}`}>
        <img
          className="w-full object-cover  object-center h-auto md:h-52 lg:h-48 xl:h-60"
          src={
            post.photo
              ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
              : images.notFound
          }
          alt={post.title}
        />

        <div className="p-5">
          <h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text[28px] ">
            {post.title}
          </h2>
          <p className="text-dark-light mt-3 text-sm md:text-lg ">
            {post.caption}
          </p>
          <div className="flex justify-between flex-nowrap items-center mt-6">
            <div className="flex items-center gap-2 md:gap-x-2.5 ">
              <img
                className="cursor-pointer rounded-full w-9 h-9 md:w-10 md:h-10"
                src={
                  post.user.avatar
                    ? stables.UPLOAD_FOLDER_BASE_URL + post.user.avatar
                    : images.Avatar
                }
                alt="profilepicture"
              />

              <div className="flex flex-col">
                <h4 className="font-bold italic text-dark-soft text-sm md:text-base ">
                  {post.user.name}
                </h4>
                <div className="flex items-center gap-x-2">
                  {post.user.verified ? (
                    <span className="bg-[#35B37E] w-fit bg-opacity-20 p-1.5 rounded-full">
                      <BiCheck className="w-3 h-3 text-[#1c7650]" />
                    </span>
                  ) : (
                    <span className="bg-[#c89494] w-fit bg-opacity-20 p-1.5 rounded-full">
                      <MdOutlineNotInterested className="w-3 h-3 text-[#d23c3c]" />
                    </span>
                  )}
                  <span className="italic text-dark-light text-xs md:text-sm">
                    {post.user.verified ? "Verified" : "Unverified"} Writer
                  </span>
                </div>
              </div>
            </div>
            <span className=" flex gap-2 font-bold text-dark-light italic text-sm md:text-base ">
              <p>{new Date(post.createdAt).getDate()}</p>
              {new Date(post.createdAt).toLocaleDateString("default", {
                month: "long",
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
