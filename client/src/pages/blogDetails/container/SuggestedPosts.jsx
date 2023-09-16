import { Link } from "react-router-dom";
export const SuggestedPosts = ({ className, header, posts = [], tags }) => {
  return (
    <div
      className={`w-full shadow-2xl shadow-blue-500/60 rounded-lg p-5 lg:mx-5  ${className}`}
    >
      <h2 className="font-roboto font-medium text-dark-hard md:text-2xl">
        {header}
      </h2>
      <div className="grid gap-y-5 mt-5 md:grid-cols-2 lg:grid-cols-1 md:gap-x-6  ">
        {posts.map((items) => (
          <div
            key={items._id}
            className="flex space-x-3 md:space-x-3 flex-nowrap items-center "
          >
            <img
              src={items.image}
              alt="technology"
              className=" object-cover rounded-lg w-[40%] h-[100%] md:w-[30%] md:h-[90%]  "
            />
            <div className=" font-medium  ">
              <h3 className="text-sm font-roboto text-dark-hard md:text-lg lg:text-sm ">
                {items.title}
              </h3>
              <span className="text-xs opacity-60 md:text-sm ">
                {new Date(items.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <h2 className="font-roboto font-medium texr-dark-hard mt-8">Tags:</h2>
      <div className="flex flex-wrap gap-x-2 gap-y-2 mt-4">
        {tags.map((items, index) => (
          <Link
            key={index}
            className="inline-block rounded-md px-2 py-1.5 bg-primary font-roboto text-white mx-auto"
            to="/"
          >
            {items}
          </Link>
        ))}
      </div>
    </div>
  );
};
