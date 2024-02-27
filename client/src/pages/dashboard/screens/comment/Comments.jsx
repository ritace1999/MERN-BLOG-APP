import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentByPost,
  deleteComment,
  updateComment,
} from "../../../../services/index/comments";
import { useSelector } from "react-redux";
import Pagination from "../../../../components/Pagination";
import { HiOutlineTrash } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Confirmation from "../../../../components/Confirmation";
import { Link } from "react-router-dom";
import { images, stables } from "../../../../constants";
import ErrorMessage from "../../../../components/ErrorMessage";
import ToggleSwitch from "../../../../components/ToggleSwitch";

const ManageComment = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    commentId: null,
  });
  const userState = useSelector((state) => state.user);

  const {
    data: commentsData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () =>
      getCommentByPost(userState.userInfo.token, searchKeyword, currentPage),
    queryKey: ["comments", searchKeyword, currentPage],
  });

  const { mutate: mutateDelete, isLoading: deleteIsLoading } = useMutation({
    mutationFn: ({ token, commentId }) => {
      return deleteComment({ token, commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
      toast.success("Comment deleted sucessfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error:", error);
      throw error;
    },
  });
  const { mutate: mutateUpdateCommentCheck, isLoading: updateCheckIsLoading } =
    useMutation({
      mutationFn: ({ token, check, commentId }) => {
        return updateComment({ token, check, commentId });
      },
      onSuccess: (data) => {
        console.log("Data from API:", data);
        queryClient.invalidateQueries(["comments"]);
        toast.success(
          data?.updatedComment?.check === "true"
            ? "Comment approved"
            : "Comment unapproved"
        );
      },
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

  const deleteCommentHandler = ({ token, commentId }) => {
    mutateDelete({ token, commentId });
  };

  const totalPageCount = commentsData?.headers?.["x-totalpagecount"] || 0;

  return (
    <div className="my-[-45px]  ">
      <div className=" w-full px-4 mx-auto my-0 ">
        <div className="py-8">
          <div className="flex md:flex-row items-center flex-col mx-10 md:mx-0  justify-center flex-wrap md:justify-between w-full  lg:px-0 md:px-0 ">
            <h1 className="text-2xl font-semibold w-[40%] ">Comments</h1>
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
                    placeholder="Search comment..."
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
          <div className="px-4 py-4 -mx-4 overflow-x-auto overflow-y-hidden  ">
            <div className="inline-block min-w-full overflow-hidden  rounded-lg shadow ">
              <table className="min-w-full leading-normal ">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-16 md:px-20 lg:px-10 md:text-lg lg:text-sm py-3 text-sm font-normal text-left text-white bg-dark-soft uppercase  border-gray-200 "
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-14 py-3 text-sm font-normal md:text-lg lg:text-sm text-center text-white bg-dark-soft  uppercase border-gray-200"
                    >
                      Comment
                    </th>
                    <th
                      scope="col"
                      className="px-[58px] md:px-20 lg:px-[16px] py-3 text-sm font-normal text-center md:text-lg lg:text-sm  uppercase text-white bg-dark-soft   "
                    >
                      In Respond to
                    </th>
                    <th
                      scope="col"
                      className="px-[58px] md:px-[65px] lg:px-[0px] py-3 text-sm font-normal text-center text-white md:text-lg lg:text-sm bg-dark-soft  uppercase  "
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-[58px] md:px-[65px] lg:px-[0px] py-3 text-sm font-normal text-start text-white md:text-lg lg:text-sm bg-dark-soft  uppercase  "
                    >
                      Check
                    </th>
                    <th
                      scope="col"
                      className="  py-3 text-sm font-normal text-center text-white md:text-lg lg:text-sm bg-dark-soft  uppercase "
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
                  ) : isError ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        <ErrorMessage message="Error while fetching comments" />
                      </td>
                    </tr>
                  ) : !commentsData?.data ||
                    commentsData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        {searchKeyword ? (
                          <ErrorMessage
                            message={`No result for "${searchKeyword}"`}
                          />
                        ) : (
                          <ErrorMessage message="Comment not found" />
                        )}
                      </td>
                    </tr>
                  ) : (
                    commentsData?.data?.map((comment) => {
                      return (
                        <tr key={comment._id}>
                          <td className="pl-5 py-5 text-sm bg-white border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <img
                                  alt={comment?.user?.name}
                                  src={
                                    comment?.user?.avatar
                                      ? stables.UPLOAD_FOLDER_BASE_URL +
                                        comment?.user?.avatar
                                      : images.Avatar
                                  }
                                  className="mx-auto object-cover rounded-full aspect-square w-12 "
                                />
                              </div>
                              <div className="ml-3 ">
                                <p className="text-gray-900 whitespace-no-wrap  md:text-lg lg:text-sm text-center">
                                  {comment?.user?.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 lg:px-0 py-5 text-sm bg-white border-b border-gray-200 text-center">
                            <span className="relative md:text-lg lg:text-sm ">
                              {comment?.desc}
                            </span>
                            {comment?.replyOnUser !== null && (
                              <p className="text-gray-900 whitespace-no-wrap  md:text-lg lg:text-sm text-center">
                                In reply to{" "}
                                <Link
                                  to={`/blog/${comment?.post?.slug}/#comment-${comment?._id}`}
                                  className="text-blue-600 hover:opacity-70 "
                                >
                                  {comment?.replyOnUser?.name}
                                </Link>
                              </p>
                            )}
                          </td>
                          <td className="px-5 lg:px-0 py-5 text-sm bg-white border-b border-gray-200 text-center">
                            <span className="relative px-1 md:text-lg lg:text-sm  text-blue-600 hover:opacity-70">
                              <Link to={`/blog/${comment?.post?.slug}`}>
                                {comment?.post?.title}
                              </Link>
                            </span>
                          </td>

                          <td className=" px-5 py-5 text-sm bg-white border-b border-gray-200 text-center">
                            <p className="text-gray-900 whitespace-no-wrap md:text-lg lg:text-sm">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </td>
                          <td className=" justify-center items-center bg-white border-gray-200 border-b">
                            {comment.post &&
                            comment.post.user == userState.userInfo._id ? (
                              <ToggleSwitch
                                disabled={updateCheckIsLoading}
                                comment={comment}
                                mutateUpdateCommentCheck={
                                  mutateUpdateCommentCheck
                                }
                                userState={userState}
                                className="disabled:opacity-70 cursor-not-allowed"
                              />
                            ) : (
                              ""
                            )}
                          </td>

                          <td className=" flex gap-4 px-5 py-10 justify-center items-center md:py-12 lg:py-8 bg-white border-b md:text-lg  border-gray-200">
                            <button
                              disabled={deleteIsLoading}
                              onClick={() =>
                                setConfirmationModal({
                                  isOpen: true,
                                  commentId: comment._id,
                                })
                              }
                              className=" flex justify-center items-center w-8 h-8 text-white rounded-md hover:opacity-75 text-center text-[25px] bg-red-500 disabled:cursor-not-allowed "
                            >
                              <HiOutlineTrash />
                            </button>
                          </td>
                        </tr>
                      );
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

      {confirmationModal.isOpen && (
        <Confirmation
          onCancel={() =>
            setConfirmationModal({ isOpen: false, commentId: null })
          }
          message={"Are you sure want to delete this comment?"}
          onConfirm={() => {
            deleteCommentHandler({
              token: userState.userInfo.token,
              commentId: confirmationModal.commentId,
            });
            setConfirmationModal({ isOpen: false, commentId: null });
          }}
        />
      )}
    </div>
  );
};

export default ManageComment;
