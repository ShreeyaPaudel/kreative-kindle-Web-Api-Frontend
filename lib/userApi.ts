import api from "./axios";

export const updateUserProfile = async (id: string, formData: FormData) => {
  // DO NOT set content-type manually for FormData (browser will set boundary)
  const res = await api.put(`/api/auth/${id}`, formData);
  return res.data;
};