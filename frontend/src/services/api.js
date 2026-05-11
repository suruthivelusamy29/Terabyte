import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://terabyte-wew6.onrender.com",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("tb_user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAuth = err.config?.url?.includes("/auth/login") || err.config?.url?.includes("/auth/register");
      if (!isAuth) {
        localStorage.removeItem("tb_user");
        const protected_ = ["/profile", "/watchlist", "/history", "/admin"];
        if (protected_.some((p) => window.location.pathname.startsWith(p))) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
