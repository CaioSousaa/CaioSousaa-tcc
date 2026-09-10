import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem("token", data.token);
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export async function register(email: string, nome: string, senha: string) {
  return api.post("/auth/register", { email, nome, senha });
}

export async function login(email: string, senha: string) {
  return api.post("/auth/login", { email, senha });
}

export async function getMe() {
  return api.get("/auth/me");
}

export async function logout() {
  return api.post("/auth/logout");
}

export async function getBoards() {
  return api.get("/boards");
}

export async function getBoardById(id: string) {
  return api.get(`/boards/${id}`);
}

export async function createBoard(titulo: string, descricao?: string, corFundo?: string) {
  return api.post("/boards", { titulo, descricao, corFundo });
}

export async function updateBoard(
  id: string,
  titulo?: string,
  descricao?: string,
  corFundo?: string
) {
  return api.patch(`/boards/${id}`, { titulo, descricao, corFundo });
}

export async function deleteBoard(id: string) {
  return api.delete(`/boards/${id}`);
}
