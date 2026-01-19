import { useUserStore } from "~/stores/user";
import type { User } from "~/types/user";

export default defineNuxtRouteMiddleware((to, ) => {
  const storage = useStorage();
  const userStore = useUserStore()

  const token = storage.getItemString("token");
  const user: User | null = userStore?.user;

  // redirect immediately when in server and hasnt any user session
  if (!token && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }
  // redirect immediately when in server and hasnt any user session
  if (token && !user && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }

  if (process.server) return;

  // redirect to auth login
  if (to.path === "/auth/login" && token && user) {
    return navigateTo('/');
  }
});