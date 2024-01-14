import React from "react";

const ArticleCardSkeleton = ({ className }) => {
  return (
    <div
      className={`bg-slate-200 rounded-xl md:ml-[8px] lg:ml-[8px] overflow-hidden shadow-2xl shadow-blue-500/60} ${className} animate-pulse`}
    >
      {/* image */}
      <div className="w-full aspect-video bg-slate-400" />
      <div className="p-5">
        {/* title */}
        <div className="w-56 h-2 mt-4 bg-slate-400 rounded-lg" />
        {/* caption */}
        <div className="w-24 h-2 mt-4 bg-slate-400 rounded-lg" />
        <div className="flex justify-between flex-nowrap items-center mt-6">
          <div className="flex items-center gap-2 md:gap-x-2.5 ">
            {/* profile avatar*/}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-400" />
            <div className="flex flex-col">
              {/* userName */}
              <div className="w-24 h-2  bg-slate-400 rounded-lg" />
              {/* user verified */}
              <div className="w-16 h-2 rounded-lg mt-2 bg-slate-400" />
            </div>
          </div>
          {/* date */}
          <div className="w-10 h-2 rounded-lg mt-4 bg-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
