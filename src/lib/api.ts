import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Watchlist API calls
export const getWatchlists = async () => {
  const response = await api.get("/watchlists");
  return response.data;
};

export const getWatchlistStatus = async (movieId: number) => {
  const response = await api.get(`/watchlist/status/${movieId}`);
  return response.data.isInWatchlist;
};

export const addToWatchlist = async (movieId: number) => {
  const response = await api.post("/watchlist/movies", { movieId });
  return response.data;
};

export const removeFromWatchlist = async (movieId: number) => {
  const response = await api.delete(`/watchlist/movies/${movieId}`);
  return response.data;
};

export const getWatchlistMovies = async () => {
  const response = await api.get("/watchlist/movies");
  return response.data;
};

export const getUserRating = async (movieId: number) => {
  const response = await api.get(`/ratings/movies/${movieId}`);
  return response.data;
};

export const getAllUserRatings = async () => {
  const response = await api.get("/ratings/movies");
  return response.data;
};

export const rateMovie = async (
  movieId: number,
  rating: number,
  review?: string,
) => {
  const response = await api.post(`/ratings/movies/${movieId}`, {
    rating,
    review,
  });
  return response.data;
};

export const deleteRating = async (movieId: number) => {
  const response = await api.delete(`/ratings/movies/${movieId}`);
  return response.data;
};
