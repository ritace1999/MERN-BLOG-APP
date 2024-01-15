import { Link } from "react-router-dom";
import { stables } from "../../../constants";
import ErrorMessage from "../../../components/ErrorMessage";
export const SuggestedPosts = ({ className, header, posts = [], tags }) => {
  return (
    <div
      className={`w-full  shadow-2xl shadow-blue-500/60 rounded-lg p-5   ${className}`}
    >
      <h2 className="font-roboto font-medium text-dark-hard md:text-xl">
        {header}
      </h2>

      <div className="grid gap-y-5 mt-5 md:grid-cols-3 md:gap-x-2 lg:grid-cols-1  ">
        {posts.map((items) => (
          <Link to={`/blog/${items.slug}`} key={items._id}>
            <div
              key={items._id}
              className="flex space-x-3  flex-nowrap items-center "
            >
              <img
                src={
                  items?.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL + items.photo
                    : images.notFound
                }
                alt={items.title}
                className="  aspect-square object-cover rounded-lg w-1/5  md:w-[30%] lg:w-[22%] "
              />
              <div className=" text-sm font-roboto font-medium  ">
                <h3 className="text-sm font-roboto text-dark-hard md:text-base lg:text-md ">
                  {items.title}
                </h3>
                <span className="text-xs opacity-60  ">
                  {new Date(items.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <h2 className="font-roboto font-medium text-dark-hard mt-8 md:text-xl">
        Tags:
      </h2>
      <div className="flex flex-wrap gap-y-2 mt-4">
        {tags.length == 0 ? (
          <ErrorMessage message={"No tags available for this blog."} />
        ) : (
          tags.map((items, index) => (
            <Link
              key={index}
              className="inline-block mx-2  rounded-md px-3 py-1.5 lg:py-2.5 bg-primary font-roboto text-white  md:text-sm"
              to="/"
            >
              {items}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
