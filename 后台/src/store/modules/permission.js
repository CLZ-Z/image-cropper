import { asyncRoutes, constantRouterMap } from "@/router";
/**
 * 使用 meta.role 以确定当前用户是否具有权限
 * @param roles
 * @param route
 */
// 匹配权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach((route) => {
    const tmp = {
      ...route,
    };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRouterMap.concat(routes); // 将过滤后的路由和constantRouterMap存起来
  },
};

// 筛选
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes;
      // 管理员admin显示全部路由，
      // 我这里admin是想让它不显示全部的 想要admin能看见全部的话把注释去掉

      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
