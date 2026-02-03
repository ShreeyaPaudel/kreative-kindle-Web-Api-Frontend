import Cookies from "js-cookie";

export const saveAuth = (token: string, user: any) => {
  Cookies.set("token", token, { path: "/" });
  Cookies.set("user", JSON.stringify(user), { path: "/" });
};

export const clearAuth = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("user", { path: "/" });
};