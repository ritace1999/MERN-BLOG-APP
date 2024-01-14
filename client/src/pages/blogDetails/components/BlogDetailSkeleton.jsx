import React from "react";
import { BiImageAlt } from "react-icons/bi";

const BlogDetailSkeleton = () => {
  return (
    <section className="container mx-auto w-[88%] flex flex-col  py-5 lg:flex-row lg:gap-x5 lg:items-start animate-pulse">
      <article className="flex-1">
        {/* post image */}
        <div className="rounded-xl w-full aspect-video bg-slate-400 flex justify-center items-center">
          <BiImageAlt className="text-4xl text-slate-600" />
        </div>
        {/* title */}
        <div className="mt-4 md:text-[26px] w-2/5 h-2 rounded-lg bg-slate-400" />
        <div className="mt-4 prose prose-sm sm:prose-base">
          <p className="w-1/2 h-2 mt-6 rounded-lg bg-slate-400"></p>
          <p className="w-full h-2 mt-4 rounded-lg bg-slate-400"></p>
          <p className="w-[70%] h-2 mt-4 rounded-lg bg-slate-400"></p>
          <p className="w-4/5 h-2 mt-4 rounded-lg bg-slate-400"></p>
        </div>
      </article>

      {/* Suggested posts */}
      <div className={` w-full p-5 mt-8 lg:mt-6 lg:mx-5 lg:max-w-[360px]`}>
        {/* title */}
        <div className="w-[30%] h-2 rounded-lg bg-slate-400" />
        <div className="grid gap-y-5 mt-5 md:grid-cols-2 md:gap-x-5 lg:grid-cols-1">
          {[...Array(6)].map((item, index) => (
            <div
              key={index}
              className="flex space-x-3 flex-nowrap items-center"
            >
              {/* image */}
              <div className="aspect-square w-1/5 rounded-lg bg-slate-400" />
              <div className="w-full">
                {/* post title */}
                <div className="w-full h-2 rounded-lg bg-slate-400" />
                <p className="w-[60%] h-2 mt-4 rounded-lg bg-slate-400"></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogDetailSkeleton;
