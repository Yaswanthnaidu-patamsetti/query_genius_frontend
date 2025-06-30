import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const askQuestion = async (
  { question, targetTableName },
  accessToken
) => {
  try {
    console.log({ question, targetTableName });

    const response = await axios.post(
      `${baseUrl}/chat/question`,
      {
        question,
        targetTableName: targetTableName || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Something went wrong, please try again later.";
    throw new Error(message);
  }
};

export const fetchChat = async (accessToken, page = 1, limit = 10) => {
  try {
    const userChat = await axios.get(`${baseUrl}/chat/history`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page, limit },
    });
    console.log(userChat, "Chat service");
    return userChat;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const clearChat = async (accessToken) => {
  try {
    const clearChat = await axios.delete(`${baseUrl}/chat/reset`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(clearChat);
    return clearChat;
  } catch (error) {
    throw new Error(error);
  }
};
