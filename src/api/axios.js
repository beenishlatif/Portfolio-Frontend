import axios from "axios";

// IMPORTANT (Vercel deployment):
// Set VITE_API_URL in the frontend's Vercel project settings to your
// deployed backend URL, e.g. https://your-backend.vercel.app/api
// Locally it falls back to your dev backend on port 5000.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("portfolio-admin");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
