import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPostBySlug, updatePost } from "../../../../services/index/posts";
import BlogDetailSkeleton from "../../../blogDetails/components/blogDetailSkeleton";
import { Link, useParams, useNavigate } from "react-router-dom";
import { stables } from "../../../../constants";
import { HiOutlineCamera } from "react-icons/hi2";
import toast from "react-hot-toast";
import styles from "../../../../styles/form.module.css";
import { useSelector } from "react-redux";
import Confirmation from "../../../../components/Confirmation";
import Editor from "../../../../components/tiptap/Editor";
import MultiSelectDropDown from "../../components/MultiSelect/MultiSelectDropDown";
import { getCategories } from "../../../../services/index/categories";
import CreatableSelect from "react-select/creatable";

import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTags";

const promiseOptions = async (inputValue) => {
  const categoriesData = await getCategories();
  return filterCategories(inputValue, categoriesData.data);
};
const EditPost = () => {
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(null);
  const [createSlug, setCreateSlug] = useState(slug);
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(false);
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getPostBySlug({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data?.title);
      setTags(data?.tags);
      setCreateSlug(data?.slug);
      setCaption(data?.caption);
    },
  });

  const { mutate: mutateUpdatePost, isLoading: isLoadingUpdatePost } =
    useMutation({
      mutationFn: ({ updatedData, token, slug }) => {
        return updatePost({ updatedData, token, slug });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["blog", slug]);
        toast.success("Post Updated sucessfully");
        console.log();
        navigate(`/dashboard/posts/manage/edit/${data.updatedPost.slug}`, {
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handlePostUpdate = async () => {
    let updatedData = new FormData();
    if (photo) {
      updatedData.append("postPhoto", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let response = await fetch(url);
        let blob = await response.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.photo
      );
      updatedData.append("postPhoto", picture);
    }
    updatedData.append(
      "document",
      JSON.stringify({
        body,
        categories,
        title,
        tags,
        slug: createSlug,
        caption,
      })
    );
    mutateUpdatePost({ updatedData, slug, token: userState.userInfo.token });
  };

  const handleDeletePostPic = () => {
    setInitialPhoto(null);
    setPhoto(null);
    setConfirmationModal(false);
  };

  return (
    <div className="overflow-y-auto">
      {isLoading ? (
        <BlogDetailSkeleton />
      ) : (
        <section className=" lg:gap-x5 container mx-auto flex w-[88%]  flex-col py-5 lg:flex-row lg:items-start">
          <article className="flex-1  ">
            <label htmlFor="postPhoto" className="w-full cursor-pointer">
              {" "}
              {photo ? (
                <img
                  className="h-[200px] w-full rounded-xl md:h-[400px] lg:h-[515px]"
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                />
              ) : initialPhoto ? (
                <img
                  className="h-[200px] w-full rounded-xl md:h-[400px] lg:h-[515px]"
                  src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                />
              ) : (
                <div className=" w-full h-full min-h-[200px] bg-dark-light rounded-xl md:h-[400px] lg:h-[515px] flex justify-center items-center">
                  {" "}
                  <div className="flex flex-col items-center justify-center rounded-full bg-blue-200 h-32 w-32 border-dark-hard border hover:opacity-75">
                    <HiOutlineCamera className="w-[30px] h-auto text-dark-hard" />{" "}
                    <p>Upload Picture</p>
                  </div>
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPhoto"
              onChange={handleFileChange}
            />
            <button
              onClick={() => setConfirmationModal(true)}
              type="button"
              className="mt-5 border-red-600 border text-red-500 hover:bg-red-600 hover:text-white hover:opacity-70 rounded-lg p-2 flex mx-auto "
            >
              Delete Image
            </button>
            {confirmationModal && (
              <span className="mx-[500px]">
                <Confirmation
                  onCancel={() => setConfirmationModal(false)}
                  onConfirm={handleDeletePostPic}
                  message={"Are you sure want to delete this image ?"}
                />
              </span>
            )}
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category) => (
                <div
                  key={category._id}
                  className="inline-block font-roboto text-sm text-primary  md:text-base cursor-pointer"
                >
                  {category.title}
                </div>
              ))}
            </div>
            <div className="form-control w-full ">
              <label className="label" htmlFor="title">
                <span className="label-text text-lg">Title</span>
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..."
                className="input input-bordered border-dark-soft !outline-none bg-slate-100 font-roboto text-xl font-bold text-dark-hard "
              />
            </div>
            <div className="form-control w-full ">
              <label className="label" htmlFor="caption">
                <span className="label-text text-lg">Caption</span>
              </label>
              <input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Catpion..."
                className="input input-bordered border-dark-soft !outline-none bg-slate-100 font-roboto text-xl font-bold text-dark-hard "
              />
            </div>
            <div className="form-control w-full ">
              <label className="label" htmlFor="slug">
                <span className="label-text text-lg">Slug</span>
              </label>
              <input
                id="slug"
                value={createSlug}
                onChange={(e) =>
                  setCreateSlug(
                    e.target.value.replace(/\s+/g, "-").toLowerCase()
                  )
                }
                placeholder="Slug..."
                className="input input-bordered border-dark-soft !outline-none bg-slate-100 font-roboto text-xl font-bold text-dark-hard "
              />
            </div>
            <div className="mt-2 mb-3 relative z-50">
              <label className="label" htmlFor="categories">
                <span className="label-text text-lg">Categories</span>
              </label>
              {!isLoading && !isError && (
                <MultiSelectDropDown
                  loadOptions={promiseOptions}
                  defaultValue={data?.categories.map(categoryToOption)}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>
            <div className=" mb-5 ">
              <label className="label" htmlFor="tags">
                <span className="label-text text-lg">Tags</span>
              </label>
              {!isLoading && !isError && (
                <CreatableSelect
                  defaultValue={data?.tags.map((tag) => ({
                    value: tag,
                    label: tag,
                  }))}
                  isMulti={true}
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                  className="relative z-20 text-lg"
                />
              )}
            </div>
            <div className="prose prose-sm mt-4 bg-white  sm:prose-base border-2 border-dark-soft rounded-lg ">
              {!isLoading && !isError && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => setBody(data)}
                />
              )}
            </div>
            <div className="input_button">
              <button
                disabled={isLoadingUpdatePost}
                onClick={handlePostUpdate}
                className={`${styles.button} flex md:w-96 mx-auto  mt-6 disabled:cursor-not-allowed opacity-70 items-center justify-center`}
                type="submit"
              >
                {isLoadingUpdatePost ? "Updating..." : "Update Post"}
              </button>
            </div>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditPost;
