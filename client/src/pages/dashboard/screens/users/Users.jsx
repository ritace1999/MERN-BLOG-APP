import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../../../components/ErrorMessage";
import { images, stables } from "../../../../constants";
import Pagination from "../../../../components/Pagination";
import { HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";
import { MdVerified } from "react-icons/md";
import { FaSkullCrossbones } from "react-icons/fa";
import { useSelector } from "react-redux";
import Confirmation from "../../../../components/Confirmation";
import { getUsers, deleteUser } from "../../../../services/index/users";

const Users = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    userId: null,
  });
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    if (!userState.userInfo.superAdmin) {
      navigate("/dashboard");
      toast.error("Unauthorized");
    }
  }, [userState.userInfo.superAdmin, navigate]);

  const {
    data: usersData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () =>
      getUsers(userState.userInfo.token, searchKeyword, currentPage),
    queryKey: ["users", searchKeyword, currentPage],
  });
  const { mutate: mutateDelete, isLoading: deleteIsLoading } = useMutation({
    mutationFn: ({ token, userId }) => {
      return deleteUser({ token, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("user deleted sucessfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
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
    refetch(searchKeyword);
  };
  const deleteuserHandler = ({ token, userId }) => {
    mutateDelete({ token, userId });
  };
  const totalPageCount = usersData?.headers?.["x-totalpagecount"] || 0;

  return (
    <div className="my-[-45px]  ">
      <div className=" w-full px-4 mx-auto my-0 ">
        <div className="py-8">
          <div className="flex md:flex-row items-center flex-col mx-10 md:mx-0  justify-center flex-wrap md:justify-between w-full  lg:px-0 md:px-0 ">
            <h1 className="text-2xl font-semibold w-[40%] ">Users</h1>
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
                    placeholder="Search user..."
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
          <div className="px-4 py-4 -mx-4 overflow-x-auto ">
            <div className="inline-block min-w-full overflow-hidden  rounded-lg shadow ">
              <table className="min-w-full leading-normal ">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-16 md:px-20 lg:px-10 md:text-lg lg:text-sm py-3 text-sm font-normal text-left text-white bg-dark-soft uppercase  border-gray-200 "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-14 py-3 text-sm font-normal md:text-lg lg:text-sm text-left text-white bg-dark-soft  uppercase border-gray-200"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-[58px] md:px-20 lg:px-[45px] py-3 text-sm font-normal text-left md:text-lg lg:text-sm  uppercase text-white bg-dark-soft   "
                    >
                      Verified
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-white md:text-lg lg:text-sm bg-dark-soft  uppercase  "
                    >
                      Created At
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
                    !usersData?.data ||
                    usersData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        {searchKeyword ? (
                          <ErrorMessage
                            message={`No result for "${searchKeyword}"`}
                          />
                        ) : (
                          <ErrorMessage message="User not found" />
                        )}
                      </td>
                    </tr>
                  ) : (
                    usersData?.data?.map((user) => {
                      return (
                        <tr key={user._id}>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <img
                                  alt="profile"
                                  src={
                                    user?.avatar
                                      ? stables.UPLOAD_FOLDER_BASE_URL +
                                        user?.avatar
                                      : images.notFound
                                  }
                                  className="mx-auto object-cover rounded-lg aspect-square w-12 "
                                />
                              </div>
                              <div className="ml-3 ">
                                <p className="text-gray-900 whitespace-no-wrap  md:text-lg lg:text-sm text-center">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-16 py-5 text-sm bg-white border-b border-gray-200 md:text-lg lg:text-sm">
                            {user.email}
                          </td>
                          <td className="px-12 py-5 text-sm bg-white border-b border-gray-200">
                            <span className="relative px-1 text-2xl">
                              {user.verified ? (
                                <MdVerified className="text-green-500" />
                              ) : (
                                <FaSkullCrossbones className="text-red-600" />
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap md:text-lg lg:text-sm">
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </td>
                          <td className=" flex gap-2 px-6 py-12 items-center bg-white border-b md:text-lg  border-gray-200">
                            <button
                              disabled={deleteIsLoading}
                              onClick={() =>
                                setConfirmationModal({
                                  isOpen: true,
                                  userId: user._id,
                                })
                              }
                              className="flex r justify-center items-center w-8 h-8 text-white rounded-md hover:opacity-75 text-center text-[25px] bg-red-500 disabled:cursor-not-allowed "
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
          onCancel={() => setConfirmationModal({ isOpen: false, userId: null })}
          message={"Are you sure want to delete this user?"}
          onConfirm={() => {
            deleteuserHandler({
              userId: confirmationModal.userId,
              token: userState.userInfo.token,
            });
            setConfirmationModal({ isOpen: false, userId: null });
          }}
        />
      )}
    </div>
  );
};

export default Users;
