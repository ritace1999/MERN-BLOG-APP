import axios from "axios";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
});

export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/register", formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/login", formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};

export const getUserProfile = async ({ token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.get("/profile", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};

export const updateProfile = async ({ token, userData }) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axiosInstance.put("/profile/edit", userData, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const updatePassword = async ({ token, userData }) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axiosInstance.put(
      "/profile/edit-password",
      userData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const updateProfilePic = async ({ token, formData }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axiosInstance.put(
      "/profile/edit-avatar",
      formData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.msg)
      throw new Error(error.response.data.msg);
    throw error;
  }
};
export const deleteAvatar = async (token, userId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.delete(
      `/profile/delete-avatar/${userId}`, // Correctly pass userId in the URL
      config
    );

    return response;
  } catch (error) {
    if (error.response && error.response.data.msg) {
      // Include the server's error message in the return object
      return { msg: error.response.data.msg };
    } else {
      // If there's no specific server error message, throw the original error
      throw error;
    }
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.put(`/reset-password/${token}`, {
      password: newPassword,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg) {
      return { success: false, msg: error.response.data.msg };
    } else {
      throw error;
    }
  }
};

export const verifyOTP = async (email, enteredOTP) => {
  try {
    const response = await axiosInstance.post("/verify-otp", {
      email,
      otp: enteredOTP,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg) {
      // Include the server's error message in the return object
      return { msg: error.response.data.msg };
    } else {
      // If there's no specific server error message, throw the original error
      throw error;
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/forgot-password", {
      email,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.msg) {
      // Include the server's error message in the return object
      return { msg: error.response.data.msg };
    } else {
      // If there's no specific server error message, throw the original error
      throw error;
    }
  }
};

export const getUsers = async (
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
      `/users?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const deleteUser = async ({ token, userId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.delete(
      `/users/delete/${userId}`,
      config
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
