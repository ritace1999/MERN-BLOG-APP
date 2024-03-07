import toast from "react-hot-toast";
const CategoryPopupModal = ({
  onCancel,
  categoryTitle,
  setCategoryTitle,
  updateIsLoading,
  categoryUpdateModal,
  mutateUpdateCategory,
  setCategoryUpdateModal,
  refetch,
  token,
}) => {
  const updateCategoryHandler = (e) => {
    e.preventDefault();
    if (!categoryTitle) {
      return toast.error("Title cannot be empty");
    }
    mutateUpdateCategory({
      title: categoryTitle,
      token: token,
      categoryId: categoryUpdateModal.categoryId,
    });
    setCategoryUpdateModal({
      isOpen: false,
      categoryId: null,
    });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-60"></div>
      <div className="relative bg-white p-6 rounded-md text-center">
        <p className="mb-4 text-gray-500">Title</p>
        <div className="flex justify-center items-center space-x-4">
          <form
            onSubmit={(e) => updateCategoryHandler(e)}
            className="flex flex-col gap-4 w-[220px] md:w-[300px]"
          >
            <input
              type="text"
              id="update-category"
              className="rounded-lg placeholder:mx-0 md:text-lg lg:text-sm flex-1 border border-dark-hard w-full py-2 text-center bg-slate-200 text-dark-hard focus:outline-none"
              placeholder="Update category..."
              onChange={(e) => setCategoryTitle(e.target.value)}
              value={categoryTitle}
            />
            <div className="flex gap-4 justify-center ">
              <button
                onClick={onCancel}
                className="py-2 px-5 text-sm font-medium text-white bg-red-700 rounded-lg hover:opacity-85 "
              >
                Cancel
              </button>
              <button
                disabled={updateIsLoading}
                type="submit"
                className="py-2 px-5 text-sm font-medium disabled:cursor-not-allowed text-white bg-green-700 rounded-lg hover:opacity-85 "
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryPopupModal;
