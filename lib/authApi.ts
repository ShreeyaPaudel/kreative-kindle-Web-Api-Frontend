import api from "./axios";

export const registerUser = async (payload: any) => {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload: any) => {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
};
