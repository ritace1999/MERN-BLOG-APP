import axios from "axios";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
});

export const getPost = async (searchKeyword = "", page = 1, limit = 3) => {
  try {
    const response = await axiosInstance.get(
      `/posts?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const getAllPost = async () => {
  try {
    const response = await axiosInstance.get(`/posts`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const getUserPost = async (
  token,
  searchKeyword = "",
  page = 1,
  limit = 5
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.get(
      `/posts/user?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
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

export const deletePost = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.delete(`/posts/${slug}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};

export const updatePost = async ({ updatedData, token, slug }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.put(
      `/posts/${slug}`,
      updatedData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const createPost = async ({ token }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.post(`/posts`, {}, config);

    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    console.log(error);
    throw error;
  }
};
