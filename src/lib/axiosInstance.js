import axios from "axios";
import { authStore } from "@/stores/auth.store";
import { toast } from "sonner";

// Флаг для предотвращения гонки при обновлении токена:
// Позволяет только одному запросу инициировать refresh.
let isRefreshing = false;
// Очередь запросов, ожидающих новый токен.
let failedRequestsQueue = [];

// ==========================================
// Normalize error messages (без изменений, т.к. функция хорошая)
// ==========================================
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

// ==========================================
// Axios instance
// ==========================================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ==========================================
// Request interceptor: attach access token
// ==========================================
api.interceptors.request.use((config) => {
  // ✅ Упрощенный доступ к MobX:
  const token = authStore.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// Response interceptor (errors + refresh)
// ==========================================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const responseStatus = error.response?.status;
    const data = error.response?.data;
    const msg = toErrorMessage(data);

    // ==========================
    // REFRESH TOKEN LOGIC
    // ==========================

    // 1. Проверяем статус 401 и не является ли это повторным запросом
    if (responseStatus === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      // 2. ⚡️ Логика гонки:
      // Если токен уже обновляется, ставим запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, originalRequest });
        })
          .then(token => {
            // Повторяем запрос с новым токеном
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            // Если refresh не удался, отклоняем оригинальный запрос
            return Promise.reject(err);
          });
      }

      // 3. 🚦 Первый запрос начинает обновление
      isRefreshing = true;
      let newAccessToken = null;

      try {
        // ✅ Упрощенный доступ к MobX:
        const ok = await authStore.refresh();

        if (ok) {
          newAccessToken = authStore.accessToken;
          // Повторяем все запросы из очереди
          failedRequestsQueue.forEach(({ resolve, originalRequest }) => {
            resolve(newAccessToken); // Разрешаем промис с новым токеном
          });
          failedRequestsQueue = [];

          // Повторяем текущий запрос
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        // Если обновление не удалось (токен устарел или ошибка)
        failedRequestsQueue.forEach(({ reject }) => reject(e));
        failedRequestsQueue = [];
        // ✅ Упрощенный доступ к MobX:
        authStore.logout();

      } finally {
        isRefreshing = false;
      }
    }

    // 4. Показываем уведомление об ошибке
    // Показываем, только если это не сам запрос на refresh
    if (originalRequest?.url !== "/auth/refresh") {
      toast.error(msg);
    }

    // Отклоняем промис
    return Promise.reject(error);
  }
);

export default api;