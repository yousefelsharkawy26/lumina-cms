import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";
import { useSettingsStore } from "./store/useSettingsStore";
import AppRouter from "./router/router";

// Setup global axios interceptor for JWT
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/users/refresh') {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        try {
          const res = await axios.post("/api/users/refresh", { refreshToken });
          
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return axios(originalRequest);
          }
        } catch {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    
    return Promise.reject(error);
  }
);

function App() {
  const { checkAuth } = useAuthStore();
  const { fetchSettings, loading } = useSettingsStore();

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, [checkAuth, fetchSettings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
