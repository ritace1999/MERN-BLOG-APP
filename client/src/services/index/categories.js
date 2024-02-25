import axios from "axios";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
});

export const getCategories = async (
  searchKeyword = "",
  page = 1,
  limit = 4
) => {
  try {
    const response = await axiosInstance.get(
      `/categories?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const getCategoriesById = async ({ categoryId }) => {
  try {
    const response = await axiosInstance.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createCategories = async ({ title, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.post(
      "/categories",
      {
        title,
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

export const updateCategory = async ({ token, categoryId, title }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.put(
      `/categories/${categoryId}`,
      { title },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};

export const deleteCategory = async ({ token, categoryId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.delete(
      `/categories/${categoryId}`,
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
