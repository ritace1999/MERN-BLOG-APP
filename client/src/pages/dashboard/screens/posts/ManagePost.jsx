import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getPost } from "../../../../services/index/posts";
import { Link } from "react-router-dom";
import ErrorMessage from "../../../../components/ErrorMessage";
import { images, stables } from "../../../../constants";
import Pagination from "../../../../components/Pagination";
import { HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Confirmation from "../../../../components/Confirmation";

const ManagePost = () => {
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const userState = useSelector((state) => state.user);
  console.log(userState.userInfo._id);

  const {
    data: postsData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () => getPost(searchKeyword, currentPage, userState.userInfo._id),
    queryKey: ["posts"],
  });
  const { mutate: mutateDelete, isLoading: deleteIsLoading } = useMutation({
    mutationFn: ({ slug, token }) => {
      return deletePost({ slug, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post deleted sucessfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log("Error:", error);
      throw error;
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
  const deletePostHandler = ({ slug, token }) => {
    mutateDelete({ slug, token });
  };
  const totalPageCount = postsData?.headers?.["x-totalpagecount"] || 0;

  return (
    <div className="my-[-45px]  ">
      <div className=" w-full px-4 mx-auto my-0 ">
        <div className="py-8">
          <div className="flex md:flex-row items-center flex-col mx-10 md:mx-0  justify-center flex-wrap md:justify-between w-full  lg:px-0 md:px-0 ">
            <h1 className="text-2xl font-semibold w-[40%] ">Posts</h1>
            <div className="text-end">
              <form
                onSubmit={submitSearchHandler}
                className="flex flex-col justify-center  w-3/4 max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0"
              >
                <div className=" relative w-full ">
                  <input
                    type="text"
                    id="form-subscribe-Filter"
                    className=" rounded-lg placeholder:mx-0 md:text-lg lg:text-sm flex-1  w-full py-2 px-20 bg-slate-200 border-dark-hard border  text-dark-hard focus:outline-none "
                    placeholder="Search post..."
                    onChange={searchKeywordHandler}
                    value={searchKeyword}
                  />
                </div>
                <button
                  className="flex-shrink-0 px-5 py-2 text-base font-semibold md:text-lg lg:text-sm text-white bg-dark-soft rounded-lg shadow-md  focus:outline-none hover:opacity-75"
                  type="submit"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
          <div className="px-4 py-4 -mx-4 overflow-x-auto overflow-y-hidden sm:-mx-8 sm:pl-8 ">
            <div className="inline-block min-w-full overflow-hidden  rounded-lg shadow ">
              <table className="min-w-full leading-normal ">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-16 md:px-20 lg:px-10 md:text-lg lg:text-sm py-3 text-sm font-normal text-left text-white bg-dark-soft uppercase  border-gray-200 "
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-14 py-3 text-sm font-normal md:text-lg lg:text-sm text-left text-white bg-dark-soft  uppercase border-gray-200"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-[58px] md:px-20 lg:px-[45px] py-3 text-sm font-normal text-left md:text-lg lg:text-sm  uppercase text-white bg-dark-soft   "
                    >
                      Created at
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-white md:text-lg lg:text-sm bg-dark-soft  uppercase  "
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className=" py-3 text-sm font-normal text-left text-white md:text-lg lg:text-sm bg-dark-soft  uppercase "
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        <span className="loading loading-dots loading-lg text-black" />
                      </td>
                    </tr>
                  ) : isError ||
                    !postsData?.data ||
                    postsData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        {searchKeyword ? (
                          <ErrorMessage
                            message={`No result for "${searchKeyword}"`}
                          />
                        ) : (
                          <ErrorMessage message="Post not found" />
                        )}
                      </td>
                    </tr>
                  ) : (
                    postsData?.data?.map((post) => {
                      if (post.user._id === userState.userInfo._id) {
                        return (
                          <tr key={post._id}>
                            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <Link
                                    to={`/blog/${post.slug}`}
                                    className="relative block"
                                  >
                                    <img
                                      alt="profile"
                                      src={
                                        post?.photo
                                          ? stables.UPLOAD_FOLDER_BASE_URL +
                                            post?.photo
                                          : images.notFound
                                      }
                                      className="mx-auto object-cover rounded-lg aspect-square w-12 "
                                    />
                                  </Link>
                                </div>
                                <div className="ml-3 ">
                                  <p className="text-gray-900 whitespace-no-wrap  md:text-lg lg:text-sm text-center">
                                    {post.title}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-5 text-sm bg-white border-b border-gray-200 md:text-lg lg:text-sm">
                              {post.categories == ""
                                ? "Uncatogorized"
                                : post.categories.map((category) => (
                                    <p
                                      className="text-gray-900 whitespace-no-wrap "
                                      key={category._id}
                                    >
                                      {category.title}
                                    </p>
                                  ))}
                            </td>
                            <td className="px-12 py-5 text-sm bg-white border-b border-gray-200">
                              <p className="text-gray-900 whitespace-no-wrap md:text-lg lg:text-sm">
                                {new Date(post.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </td>
                            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                              <span className="relative px-1 md:text-lg lg:text-sm">
                                {post.tags == ""
                                  ? "No tags"
                                  : post.tags.join(", ")}
                              </span>
                            </td>
                            <td className=" flex gap-2 px-6 py-10 md:py-12 lg:py-8 items-center bg-white border-b md:text-lg  border-gray-200">
                              <button
                                disabled={deleteIsLoading}
                                onClick={() => setConfirmationModal(true)}
                                className="flex r justify-center items-center w-8 h-8 text-white rounded-md hover:opacity-75 text-center text-[25px] bg-red-500 disabled:cursor-not-allowed "
                              >
                                <HiOutlineTrash />
                              </button>
                              {confirmationModal && (
                                <span>
                                  <Confirmation
                                    onCancel={() => setConfirmationModal(false)}
                                    message={
                                      "Are you sure want to delete this post ?"
                                    }
                                    onConfirm={() => {
                                      deletePostHandler({
                                        slug: post?.slug,
                                        token: userState.userInfo.token,
                                      });
                                    }}
                                  />
                                </span>
                              )}

                              <Link
                                to={`/dashboard/posts/manage/edit/${post?.slug}`}
                                className="text-white w-8 h-8 text-[25px] text-center flex justify-center items-center rounded-md hover:opacity-75 bg-green-600"
                              >
                                <BiEdit />
                              </Link>
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })
                  )}
                </tbody>
              </table>
              {!isLoading && (
                <Pagination
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  totalPageCount={totalPageCount}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePost;
