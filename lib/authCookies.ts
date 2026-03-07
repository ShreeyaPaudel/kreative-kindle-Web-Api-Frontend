import Cookies from "js-cookie";

export const saveAuth = (token: string, user: any) => {
  Cookies.set("token", token);
  Cookies.set("user", JSON.stringify(user));
};

export const clearAuth = () => {
  Cookies.remove("token");
  Cookies.remove("user");
};
