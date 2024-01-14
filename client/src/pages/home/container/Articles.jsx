import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArticleCard } from "../../../components/ArticleCard";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { getPost } from "../../../services/index/posts";
import toast from "react-hot-toast";

export const Articles = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: getPost,
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
      console.log(data);
    },
  });

  return (
    <section className="container flex flex-col px-5 py-4">
      <div className="flex flex-wrap md:gap-x-4 gap-y-5 pb-10">
        {!isLoading &&
          !isError &&
          data &&
          data.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)] "
            />
          ))}
      </div>
      <button className="flex mx-auto item-center gap-x-2 font-bold text-primary  border-2 border-blue-600 px-3 py-3 rounded-xl hover:bg-blue-600 hover:text-white ">
        <Link to="/articles">
          <span>More Articles</span>
        </Link>
        <RiArrowRightDoubleFill className="m-auto w-5 h-5" />
      </button>
    </section>
  );
};
