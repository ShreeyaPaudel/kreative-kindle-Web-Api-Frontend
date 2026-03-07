// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3001",
// });

// // ✅ Attach token automatically
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // or sessionStorage

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// ✅ Read token from cookies (not localStorage)
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^|;)\s*token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;