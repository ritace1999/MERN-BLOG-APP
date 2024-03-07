import axios from "axios";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
});

export const getComment = async (
  token,
  searchKeyword = "",
  page = 1,
  limit = 5
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axiosInstance.get(
      `/comments?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const getCommentByPost = async (
  token,
  searchKeyword = "",
  page = 1,
  limit = 5
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axiosInstance.get(
      `/comments/?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );
    console.log(response);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createComment = async ({
  token,
  desc,
  slug,
  parent,
  replyOnUser,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.post(
      "/comments",
      {
        desc,
        slug,
        parent,
        replyOnUser,
      },
      config
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const updateComment = async ({ token, desc, check, commentId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.put(
      `/comments/${commentId}`,
      {
        desc,
        check,
      },
      config
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const deleteComment = async ({ token, commentId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.delete(
      `/comments/${commentId}`,
      config
    );
    console.log(response);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
