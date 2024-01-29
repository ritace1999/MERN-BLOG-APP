import { Link, useParams } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import { MainLayout } from "../../components/MainLayout";
import { images, stables } from "../../constants";
import { SuggestedPosts } from "./container/SuggestedPosts";
import { CommentsContainer } from "../../components/comments/CommentsContainer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPost, getPostBySlug } from "../../services/index/posts";
import BlogDetailSkeleton from "./components/blogDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import { useSelector } from "react-redux";
import { parseJsonToHTML } from "../../utils/parseJsonToHTML";
import Editor from "../../components/tiptap/Editor";

export const BlogDetailsPage = () => {
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);
  const [breadCrumbsData, setBreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);

  const { data, isError, isLoading } = useQuery({
    queryFn: () => getPostBySlug({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setBreadCrumbsData([
        { name: "Home", link: "/" },
        { name: "Blog", link: "/blog" },
        { name: "Article title", link: `/blog/${data.slug}` },
      ]);

      setBody(parseJsonToHTML(data?.body));
    },
  });
  const { data: postsData } = useQuery({
    queryFn: () => getPost(),
    queryKey: ["posts"],
  });

  return (
    <MainLayout>
      {isLoading ? (
        <BlogDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message={"Error occured while fetching data."} />
      ) : (
        <section className=" lg:gap-x5 container mx-auto flex w-[88%]  flex-col py-5 lg:flex-row lg:items-start">
          <article className="flex-1  ">
            <BreadCrumbs data={breadCrumbsData} />
            <img
              className="h-[200px] w-full rounded-xl md:h-[400px] lg:h-[515px]"
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data.photo
                  : images.notFound
              }
              alt="art"
            />
            <div className="mt-4 pl-2 flex gap-2">
              {data?.categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/blog?category=${category.title}`}
                  className="inline-block font-roboto text-sm text-primary  md:text-base"
                >
                  {category.title}
                </Link>
              ))}
            </div>
            <h1 className="mt-4 pl-2 font-roboto text-lg font-bold text-dark-hard md:text-[26px]">
              {data?.title}
            </h1>
            {!isLoading && !isError && (
              <Editor content={data?.body} editable={false} />
            )}
            <CommentsContainer
              comments={data?.comments}
              className="mt-10 "
              logginedUserId={userState?.userInfo?._id}
              postSlug={slug}
            />
          </article>
          <SuggestedPosts
            header={"Latest Article"}
            posts={postsData?.data}
            tags={data?.tags}
            className="mt-8 lg:mx-5 lg:mt-14 lg:max-w-[360px] "
          />
        </section>
      )}
    </MainLayout>
  );
};
