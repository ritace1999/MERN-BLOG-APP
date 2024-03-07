import { Link } from "react-router-dom";
import { ArticleCard } from "../../../components/ArticleCard";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";

export const Articles = ({ data, isLoading, isError }) => {
  return (
    <section className="container flex flex-col px-5 py-4 lg:py-0">
      {isError ? (
        <ErrorMessage message="Error occurred while fetching data." />
      ) : (
        <>
          <div className="flex flex-wrap md:gap-x-4 gap-y-5 pb-10">
            {isLoading ? (
              [...Array(3)].map((item, index) => (
                <ArticleCardSkeleton
                  key={index}
                  className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                />
              ))
            ) : data && data.length > 0 ? (
              data.map((post) => (
                <ArticleCard
                  key={post._id}
                  post={post}
                  className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)] "
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-5">
                <ErrorMessage message={"No Articles Available"} />
              </div>
            )}
          </div>
          <Link to="/articles">
            <button className="flex mx-auto item-center gap-x-2 font-bold text-primary border-2 border-blue-600 px-3 py-3 rounded-xl hover:bg-blue-600 hover:text-white">
              <span>More Articles</span>

              <RiArrowRightDoubleFill className="m-auto w-5 h-5" />
            </button>
          </Link>
        </>
      )}
    </section>
  );
};
