import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Home from "../views/Home.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/auth/Register.vue"),
  },
  {
    path: "/movies/:id",
    name: "movie-details",
    component: () => import("../views/movies/MovieDetails.vue"),
    // meta: { requiresAuth: true },
  },
  {
    path: "/watchlist",
    name: "watchlist",
    component: () => import("../views/watchlist/WatchlistPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/profile/ProfilePage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ratings",
    name: "ratings",
    component: () => import("../views/profile/RatingsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/movies/SearchResults.vue"),
  },
];

// Navigation guard
export function setupRouteGuards(router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: "login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  });
}
