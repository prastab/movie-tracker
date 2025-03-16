import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { jwtDecode } from "jwt-decode";
import { api } from "../lib/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<any>(null);

  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("token", newToken);
      user.value = jwtDecode(newToken);
    } else {
      localStorage.removeItem("token");
      user.value = null;
    }
  }
  // Initialize user from token if it exists
  if (token.value) {
    try {
      setToken(token.value);
    } catch (error) {
      console.error("Failed to decode token:", error);
      token.value = null;
      localStorage.removeItem("token");
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Login user and set token
  async function login(email: string, password: string) {
    try {
      const response = await api.post("/auth/login", { email, password });
      setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error.response?.data?.error || "Login failed";
    }
  }

  // Register user and set token
  async function register(email: string, password: string) {
    try {
      const response = await api.post("/auth/register", { email, password });
      token.value = response.data.token;
      setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message,
      );
      throw error.response?.data?.error || "Registration failed";
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };
});
