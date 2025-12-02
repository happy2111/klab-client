import axios from "axios";
import { authStore } from "@/stores/auth.store";
import { toast } from "sonner";

let isRefreshing = false;
let failedRequestsQueue = [];

function toErrorMessage(payload) {
  function asString(v) {
    if (v == null) return null;

    if (typeof v === "string") {
      return v.trim() || null;
    }

    if (Array.isArray(v)) {
      const parts = v
        .map((x) => asString(x))
        .filter(x => Boolean(x));
      return parts.length ? Array.from(new Set(parts)).join(", ") : null;
    }

    if (typeof v === "object") {
      const keysToTry = ["message", "error", "detail", "description", "statusText", "errorMessage"];
      for (const k of keysToTry) {
        const got = asString(v[k]);
        if (got) return got;
      }

      if (v.message && typeof v.message === "object") {
        const nested = asString(v.message.message) || asString(v.message.error);
        if (nested) return nested;
      }
    }

    try {
      return JSON.stringify(v);
    } catch (e) {
      // Игнорируем ошибки
    }

    return "Server error";
  }

  return asString(payload) || "Server error";
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://klab-server.onrender.com',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authStore.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config || {};

    // Не пытаемся рефрешить, если запросившийся маршрут — это сам /auth/refresh
    const isRefreshCall = originalRequest?.url === "/auth/refresh";

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const ok = await authStore.refresh(); // обновляет токен в сторе
        if (!ok) throw new Error("Refresh failed");

        failedRequestsQueue.forEach(p => p.resolve());
        failedRequestsQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        failedRequestsQueue.forEach(p => p.reject(refreshError));
        failedRequestsQueue = [];
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Показывать ошибки только если это не 401
    if (error.response?.status !== 401) {
      const msg = toErrorMessage(error.response?.data);
      if (!isRefreshCall) {
        toast.error(msg);
      }
    }

    return Promise.reject(error);
  }
);

export default api;