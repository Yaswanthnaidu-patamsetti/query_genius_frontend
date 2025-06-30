import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const UserRegistration = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, userData);

    return response.data;
  } catch (error) {
    const message =
      error.response.data.message ||
      "Something went wrong,Please try after some time ";
    throw new Error(message);
  }
};

export const UserLogin = async (loginData) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signin`, loginData);
    return response;
  } catch (error) {
    const message =
      error.response.data.message ||
      "Something went wrong,Please try after some time !";
    throw new Error(message);
  }
};
