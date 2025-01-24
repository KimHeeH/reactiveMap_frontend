import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainPage from "../views/MainPage.vue";
import LoginPage from "../views/LoginPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/", // 기본 경로
    name: "MainPage",
    component: MainPage, // MainPage.vue 컴포넌트 렌더링
  },
  {
    path: "/login", // 로그인 페이지
    name: "LoginPage",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
