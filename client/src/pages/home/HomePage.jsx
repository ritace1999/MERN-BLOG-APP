import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../components/MainLayout";
import { Articles } from "./container/Articles";
import { Hero } from "./container/Hero";
import { getPost } from "../../services/index/posts";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";

const HomePage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () => getPost(searchKeyword, currentPage),
    queryKey: ["posts", searchKeyword, currentPage],
    onError: (error) => {
      toast.error(error.message);
    },
  });
  useEffect(() => {
    if (currentPage > 1) {
      refetch();
    }
  }, [refetch, currentPage]);

  const searchKeywordHandler = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };
  const submitSearchHandler = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  return (
    <div>
      <MainLayout>
        <Hero
          data={data?.data}
          isLoading={isLoading}
          isError={isError}
          searchKeywordHandler={searchKeywordHandler}
          searchKeyword={searchKeyword}
          submitSearchHandler={submitSearchHandler}
        />

        <Articles data={data?.data} isLoading={isLoading} isError={isError} />
      </MainLayout>
    </div>
  );
};

export default HomePage;
