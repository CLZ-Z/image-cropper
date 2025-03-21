import axios from "axios";
import { MessageBox, Message, Loading } from "element-ui";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import Cookies from "js-cookie";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["Authorization"] = `Bearer ${Cookies.get("token")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }

      return res;
    } else {
      return res;
    }
  },
  async (error) => {
    console.log("err" + error);
    if (error == "Error: Request failed with status code 401") {
      removeToken(); // must remove  /  first
      Cookies.remove("token");
    } // for debug
    Message({
      message: error.msg,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
