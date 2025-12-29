import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

// Debug
http.interceptors.request.use((config) => {
  console.log("[API REQUEST]", config.method?.toUpperCase(), (config.baseURL || "") + config.url, config.data);
  return config;
});

http.interceptors.response.use(
    (res) => {
      console.log("[API RESPONSE]", res.status, res.config.url, res.data);
      return res;
    },
    (err) => {
      console.log("[API ERROR]", err?.response?.status, err?.config?.url, err?.response?.data || err.message);
      return Promise.reject(err);
    }
);

export default http;
