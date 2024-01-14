import { Link, useParams } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import { MainLayout } from "../../components/MainLayout";
import { images, stables } from "../../constants";
import { SuggestedPosts } from "./container/SuggestedPosts";
import { CommentsContainer } from "../../components/comments/CommentsContainer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPostBySlug } from "../../services/index/posts";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import { generateHTML } from "@tiptap/html";
import parse from "html-react-parser";
import BlogDetailSkeleton from "./components/blogDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";

const postsData = [
  {
    _id: "1",
    image: images.PostOneImage,
    title: "Futures signal crypto's mainstream adoption.",
    createdAt: "2023-09-01",
  },
  {
    _id: "2",
    image: images.PostOneImage,
    title: "Futures signal crypto's mainstream adoption.",
    createdAt: "2023-09-01",
  },
  {
    _id: "3",
    image: images.PostOneImage,
    title: "Futures signal crypto's mainstream adoption.",
    createdAt: "2023-09-01",
  },
  {
    _id: "4",
    image: images.PostOneImage,
    title: "Futures signal crypto's mainstream adoption.",
    createdAt: "2023-09-01",
  },
];
const tagsData = [
  "Technology",
  "Science",
  "Education",
  "Foods",
  "Medical",
  "Life",
  "Nature",
];

export const BlogDetailsPage = () => {
  const { slug } = useParams();
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

      setBody(
        parse(
          generateHTML(data?.body, [Document, Paragraph, Text, Bold, Italic])
        )
      );
    },
  });

  return (
    <MainLayout>
      {isLoading ? (
        <BlogDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message={"Error occured while fetching data."} />
      ) : (
        <section className=" container mx-auto w-[88%] flex flex-col  py-5 lg:flex-row lg:gap-x5 lg:items-start">
          <article className="flex-1  ">
            <BreadCrumbs data={breadCrumbsData} />
            <img
              className="rounded-xl w-full"
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data.photo
                  : images.notFound
              }
              alt="art"
            />
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/blog?category=${category.title}`}
                  className="text-primary text-sm font-roboto inline-block  md:text-base"
                >
                  {category.title}
                </Link>
              ))}
            </div>

            <h1 className="text-lg font-bold font-roboto mt-4 text-dark-hard md:text-[26px]">
              {data?.title}
            </h1>
            <div className="mt-4 prose prose-sm sm:prose-base">{body}</div>
            <CommentsContainer className="mt-10 " logginedUserId="a" />
          </article>
          <SuggestedPosts
            header={"Latest Article"}
            posts={postsData}
            tags={tagsData}
            className="mt-8 lg:mt-10 lg:mx-5 lg:max-w-[360px] "
          />
        </section>
      )}
    </MainLayout>
  );
};
