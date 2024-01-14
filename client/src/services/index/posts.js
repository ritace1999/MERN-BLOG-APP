import axios from "axios";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
});

export const getPost = async () => {
  try {
    const response = await axiosInstance.get("/posts");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const getPostBySlug = async ({ slug }) => {
  try {
    const response = await axiosInstance.get(`/posts/${slug}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
