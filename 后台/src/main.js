import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import zhLocale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import moment from "moment";
import "@/styles/index.scss"; // global css
import "font-awesome/css/font-awesome.min.css";
import App from "./App";
import store from "./store";
import router from "./router";
import Cookies from "js-cookie";
import * as echarts from "echarts";
import VueIframe from "vue-iframes";
import "@/icons";
import "@/permission";
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

Vue.use(VueIframe);
Vue.use(ElementUI, { zhLocale });
Vue.prototype.date = moment;
Vue.prototype.Cookies = Cookies;
Vue.prototype.yfai = Cookies.get("yfai");
Vue.prototype.phone = Cookies.get("phone");

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
