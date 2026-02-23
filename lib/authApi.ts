import api from "./axios";

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
};

export const registerUser = async (payload: any) => {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
};

export const requestPasswordReset = async (payload: { email: string }) => {
  const res = await api.post("/api/auth/forgot-password", payload);
  return res.data;
};

export const resetPassword = async (payload: { token: string; password: string }) => {
  const res = await api.post("/api/auth/reset-password", payload);
  return res.data;
};