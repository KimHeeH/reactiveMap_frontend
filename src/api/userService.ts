import { SERVER_ADDRESS } from "../serverAddress";

export const fetchUser = async () => {
  const response = await SERVER_ADDRESS.get("/user");
  return response.data;
};
