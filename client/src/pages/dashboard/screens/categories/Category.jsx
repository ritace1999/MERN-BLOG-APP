import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Pagination from "../../../../components/Pagination";
import { HiOutlineTrash } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Confirmation from "../../../../components/Confirmation";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../../../components/ErrorMessage";

import {
  createCategories,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../../services/index/categories";
import { FiSearch } from "react-icons/fi";
import { TbCategoryPlus } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import CategoryPopupModal from "../../../../components/categoryPopupModal";

const Category = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [categoryTitle, setCategoryTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [categoryUpdateModal, setCategoryUpdateModal] = useState({
    isOpen: false,
    categoryId: null,
  });

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    categoryId: null,
  });

  const userState = useSelector((state) => state.user);
  useEffect(() => {
    if (!userState.userInfo.superAdmin) {
      navigate("/dashboard");
      toast.error("Unauthorized");
    }
  }, [userState.userInfo.superAdmin, navigate]);

  const {
    data: categoriesData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () => getCategories(searchKeyword, currentPage),
    queryKey: ["categories", searchKeyword, currentPage],
  });

  const { mutate: mutateDelete, isLoading: deleteIsLoading } = useMutation({
    mutationFn: ({ token, categoryId }) => {
      return deleteCategory({ token, categoryId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category deleted sucessfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error:", error);
      throw error;
    },
  });
  const { mutate: mutateCreateCategory, isLoading: createIsLoading } =
    useMutation({
      mutationFn: ({ title, token }) => {
        return createCategories({
          title,
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["categories"]);
        toast.success(data.msg);
      },
      onError: (error) => {
        toast.error("Category cannot be empty");
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
  const submitAddCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      await mutateCreateCategory({
        title: addCategory,
        token: userState.userInfo.token,
      });
      setAddCategory("");
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const deletecategoryHandler = ({ token, categoryId }) => {
    mutateDelete({ token, categoryId });
  };

  const { mutate: mutateUpdateCategory, isLoading: updateIsLoading } =
    useMutation({
      mutationFn: ({ title, token, categoryId }) => {
        return updateCategory({
          title,
          token,
          categoryId,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["categories", categoryId]);
        toast.success(data.msg);
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const totalPageCount = categoriesData?.headers?.["x-totalpagecount"] || 0;

  return (
    <div className="my-[-45px]   ">
      <div className=" w-full px-4  my-0 overflow-hidden ">
        <div className="py-2 ">
          <h1 className="text-2xl font-semibold w-[40%] mt-5 ">Categories</h1>
          <div className="w-full flex flex-col md:flex-row  ">
            <div className=" w-full flex md:flex-row my-4 items-start flex-col  md:mx-0  justify-center flex-wrap md:justify-between   lg:px-0 md:px-0 ">
              <div className="text-end ">
                <form
                  onSubmit={submitAddCategoryHandler}
                  className=" justify-center w-[322px] lg:mr-[400px] max-w-sm space-y-3 md:flex-row md:w-[full] md:space-x-3 md:space-y-0"
                >
                  <div className=" flex flex-row w-full md:w-[350px]  ">
                    <input
                      type="text"
                      id="add-category"
                      className=" rounded-l-lg placeholder:mx-0 md:text-lg lg:text-sm flex-1 border-l border-t border-b border-dark-hard  w-full py-2 text-center bg-slate-200   text-dark-hard focus:outline-none "
                      placeholder="Add category..."
                      onChange={(e) => setAddCategory(e.target.value)}
                      value={addCategory}
                    />
                    <button
                      className="disabled:cursor-not-allowed px-5 flex-shrink-0 border-r border-t border-b border-dark-hard py-2 text-base font-semibold md:text-lg lg:text-sm text-white bg-dark-soft rounded-r-lg shadow-md  focus:outline-none hover:opacity-75"
                      type="submit"
                      disabled={createIsLoading}
                    >
                      <TbCategoryPlus />
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className=" w-full flex md:flex-row my-4 items-start flex-col  md:mx-0  justify-center flex-wrap md:justify-between   lg:px-0 md:px-0 ">
              <div className="text-end ">
                <form
                  onSubmit={submitSearchHandler}
                  className=" justify-center w-[322px]  max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0"
                >
                  <div className=" flex flex-row w-full md:w-[350px] ">
                    <input
                      type="text"
                      id="form-subscribe-Filter"
                      className=" rounded-l-lg placeholder:mx-0 md:text-lg lg:text-sm flex-1 border-l border-t border-b border-dark-hard  w-full py-2 text-center bg-slate-200   text-dark-hard focus:outline-none "
                      placeholder="Search category..."
                      onChange={searchKeywordHandler}
                      value={searchKeyword}
                    />
                    <button
                      className="px-5 flex-shrink-0 border-r border-t border-b border-dark-hard  text-base font-semibold md:text-lg lg:text-sm text-white bg-dark-soft rounded-r-lg shadow-md  focus:outline-none hover:opacity-75"
                      type="submit"
                    >
                      <FiSearch />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="px-4 py-1 -mx-4 overflow-x-auto overflow-y-hidden sm:-mx-8 sm:pl-8 ">
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
                      className="px-14 py-3 text-sm font-normal md:text-lg lg:text-sm text-center text-white bg-dark-soft  uppercase border-gray-200"
                    >
                      Created At
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
                        <ErrorMessage message="Error while fetching categorys" />
                      </td>
                    </tr>
                  ) : !categoriesData?.data ||
                    categoriesData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        {searchKeyword ? (
                          <ErrorMessage
                            message={`No result for "${searchKeyword}"`}
                          />
                        ) : (
                          <ErrorMessage message="category not found" />
                        )}
                      </td>
                    </tr>
                  ) : (
                    categoriesData?.data?.map((category) => {
                      return (
                        <tr key={category?._id}>
                          <td className="pl-5 py-5 text-sm bg-white border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="ml-3 ">
                                <p className="text-gray-900 whitespace-no-wrap  md:text-lg lg:text-sm text-center">
                                  {category?.title}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className=" px-5 py-5 text-sm bg-white border-b border-gray-200 text-center">
                            <p className="text-gray-900 whitespace-no-wrap md:text-lg lg:text-sm">
                              {new Date(category.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </td>

                          <td className=" flex gap-4 px-5 py-10 justify-center items-center md:py-12 lg:py-8 bg-white border-b md:text-lg  border-gray-200">
                            <button
                              disabled={deleteIsLoading}
                              onClick={() =>
                                setConfirmationModal({
                                  isOpen: true,
                                  categoryId: category._id,
                                })
                              }
                              className="flex justify-center items-center w-8 h-8 text-white rounded-md hover:opacity-75 text-center text-[25px] bg-red-500 disabled:cursor-not-allowed "
                            >
                              <HiOutlineTrash />
                            </button>
                            <button
                              onClick={() => {
                                setCategoryUpdateModal({
                                  isOpen: true,
                                  categoryId: category?._id,
                                });
                                setCategoryTitle(category.title);
                              }}
                              className="text-white w-8 h-8 text-[25px] text-center flex justify-center items-center rounded-md hover:opacity-75 bg-green-600"
                            >
                              <BiEdit />
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
            setConfirmationModal({ isOpen: false, categoryId: null })
          }
          message={"Are you sure want to delete this category?"}
          onConfirm={() => {
            deletecategoryHandler({
              token: userState.userInfo.token,
              categoryId: confirmationModal.categoryId,
            });
            setConfirmationModal({ isOpen: false, categoryId: null });
          }}
        />
      )}
      {categoryUpdateModal.isOpen && (
        <CategoryPopupModal
          categoryTitle={categoryTitle}
          setCategoryTitle={setCategoryTitle}
          setCategoryUpdateModal={setCategoryUpdateModal}
          mutateUpdateCategory={mutateUpdateCategory}
          token={userState.userInfo.token}
          categoryUpdateModal={categoryUpdateModal}
          updateIsLoading={updateIsLoading}
          onCancel={() =>
            setCategoryUpdateModal({ isOpen: false, categoryId: null })
          }
        />
      )}
    </div>
  );
};

export default Category;
