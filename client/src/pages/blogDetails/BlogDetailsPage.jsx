import { Link } from "react-router-dom";

import { BreadCrumbs } from "../../components/BreadCrumbs";
import { MainLayout } from "../../components/MainLayout";
import { images } from "../../constants";
import { SuggestedPosts } from "./container/SuggestedPosts";

const breadCrumbsData = [
  { name: "Home", link: "/" },
  { name: "Blog", link: "/blog" },
  { name: "Article title", link: "/blog/1" },
];

const postsData = [
  {
    _id: "1",
    image: images.PostOneImage,
    title:
      "The futures are a sign that the cryptocurrency is becoming mainstream.",
    createdAt: "2023-09-01",
  },
  {
    _id: "2",
    image: images.PostOneImage,
    title:
      "The futures are a sign that the cryptocurrency is becoming mainstream.",
    createdAt: "2023-09-01",
  },
  {
    _id: "3",
    image: images.PostOneImage,
    title:
      "The futures are a sign that the cryptocurrency is becoming mainstream.",
    createdAt: "2023-09-01",
  },
  {
    _id: "4",
    image: images.PostOneImage,
    title:
      "The futures are a sign that the cryptocurrency is becoming mainstream.",
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
  return (
    <MainLayout>
      <section className="  flex flex-col px-6 lg:px-0.5 py-0 lg:flex-row lg:gap-x-5  lg:items-start  xl:px-5 ">
        <article className="flex-1 px-4 ">
          <BreadCrumbs data={breadCrumbsData} />
          <img
            className="rounded-xl w-full"
            src={images.PostOneImage}
            alt="art"
          />
          <Link
            to="/blog?category=selectedCategory"
            className="text-primary text-sm font-roboto inline-block mt-4 md:text-[21px]"
          >
            TECHNOLOGY
          </Link>
          <h1 className="text-sm font-bold font-roboto mt-4 text-dark-hard md:text-[22px]">
            The futures are a sign that the cryptocurrency is becoming
            mainstream.
          </h1>
          <div className="mt-4 text-dark-soft">
            <p className="leading-7 text-sm md:text-xl">
              The emergence of futures contracts for cryptocurrencies signals
              their growing acceptance in mainstream finance. These contracts
              attract institutional investors, offering risk management tools,
              increased liquidity, and regulatory oversight. They contribute to
              price discovery, fostering stability. However, the cryptocurrency
              market remains speculative and volatile, necessitating caution and
              research for investors. While futures reflect a maturing
              landscape, the inherent risks, including price fluctuations and
              regulatory shifts, persist.
            </p>
          </div>
        </article>
        <SuggestedPosts
          header={"Latest Article"}
          posts={postsData}
          tags={tagsData}
          className="mt-8 lg:mt-16  lg:max-w-sm xl:mx-0 "
        />
      </section>
    </MainLayout>
  );
};
