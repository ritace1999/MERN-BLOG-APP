import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../../components/MainLayout";
import { getAllPost } from "../../../services/index/posts";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import { ArticleCard } from "../../../components/ArticleCard";
import ErrorMessage from "../../../components/ErrorMessage";

const ArticlesPage = () => {
  const {
    data: postData,
    isLoading: postIsLoading,
    isError: postError,
  } = useQuery({
    queryFn: getAllPost,
    queryKey: ["posts"],
  });

  return (
    <MainLayout>
      <div className="flex flex-wrap md:gap-x-4 gap-y-5 mt-5 mx-5 pb-10">
        {postIsLoading ? (
          [...Array(3)].map((item, index) => (
            <ArticleCardSkeleton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : postError ? (
          <ErrorMessage message="Error occurred while fetching data." />
        ) : postData && postData.data && postData.data.length > 0 ? (
          postData.data.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)] "
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full py-5">
            <ErrorMessage message={"No articles available"} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ArticlesPage;
