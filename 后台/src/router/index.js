import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    meta: {},
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
      },
    ],
  },

  {
    path: "/group",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "group",
        name: "group",
        component: () => import("@/views/group/index"),
        meta: { title: "群组", icon: "group" },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "user",
        component: () => import("@/views/user/user"),
        meta: {
          title: "用户信息",
          icon: "admin",
          roles: ["admin"],
        },
      },
    ],
  },
  {
    path: "/SubjectiveQuestion",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "SubjectiveQuestion",
        name: "SubjectiveQuestion",
        component: () => import("@/views/SubjectiveQuestion/index"),
        meta: { title: "主观题", icon: "SubjectiveQuestion" },
      },
    ],
  },
  {
    path: "/ask",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "ask",
        name: "ask",
        component: () => import("@/views/ask/index"),
        meta: { title: "问券", icon: "ask" },
      },
    ],
  },
  {
    path: "/Voicetxt",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "Voicetxt",
        name: "Voicetxt",
        component: () => import("@/views/Voicetxt/index"),
        meta: { title: "声音文本", icon: "Voicetxt" },
      },
    ],
  },

  {
    path: "/style",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "style",
        name: "style",
        component: () => import("@/views/style/style"),
        meta: { title: "风格", icon: "style" },
      },
    ],
  },
  {
    path: "/classify",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "classify",
        name: "classify",
        component: () => import("@/views/classify/classify"),
        meta: { title: "频道", icon: "list" },
      },
    ],
  },
  {
    path: "/ParentChild",
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: "ParentChild",
        name: "ParentChild",
        component: () => import("@/views/ParentChild/index"),
        meta: { title: "亲子", icon: "ParentChild" },
      },
    ],
  },
  {
    path: "/works",
    component: Layout,
    meta: { title: "作品", icon: "set", roles: ["admin"] },
    children: [
      {
        path: "agent",
        name: "agent",
        component: () => import("@/views/works/agent"),
        meta: { title: "智能体", icon: "agent" },
      },
      {
        path: "video",
        name: "video",
        component: () => import("@/views/works/video"),
        meta: { title: "视频", icon: "works", roles: ["user"] },
      },
    ],
  },
  {
    path: "/set",
    component: Layout,
    meta: { title: "设置", icon: "set", roles: ["user"] },
    children: [
      {
        path: "storeAdmin",
        component: () => import("@/views/set/storeAdmin"),
        meta: {
          title: "账号设置",
          icon: "storeAdmin",
          roles: ["admin"],
        },
      },
    ],
  },

  // 404 page must be placed at the end !!!
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap,
  });

const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
