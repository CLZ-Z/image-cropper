import { login, logout, getInfo } from "@/api/admin";
import { getToken, setToken, removeToken } from "../../utils/auth";
import { resetRouter } from "@/router";
import Cookies from "js-cookie";

const getDefaultState = () => {
  return {
    token: getToken(),
    account: "",
    avatar: "",
    roles: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ conditions: { account: username.trim(), pwd: password } })
        .then((res) => {
          const data = res.data;
          commit("SET_TOKEN", data._id);
          setToken(data._id);
          Cookies.set("token", res.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ conditions: { _id: state.token } })
        .then((response) => {
          const data = response.data;
          if (!data) {
            return reject("Verification failed, please Login again.");
          }
          const { account, avatar, roles, _id } = data[0];
          commit("SET_ACCOUNT", account);
          commit("SET_AVATAR", avatar);
          commit("SET_ROLES", roles);
          Cookies.set("phone", account);
          resolve(data[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  /  first
      resetRouter();
      Cookies.remove("token");

      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
