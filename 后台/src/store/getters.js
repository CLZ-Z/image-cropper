const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  account: (state) => state.user.account,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes, //筛选过的路由
};
export default getters;
