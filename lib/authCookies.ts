import Cookies from "js-cookie";

export const saveAuth = (token: string, user: any) => {
  Cookies.set("token", token, { path: "/" });
  Cookies.set("user", JSON.stringify(user), { path: "/" });
};

export const clearAuth = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("user", { path: "/" });
};

export const getTokenFromCookie = () => {
  return Cookies.get("token") || null;
};

export const getUserFromCookie = () => {
  const raw = Cookies.get("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};