/**
 * main.js
 *
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import vuetify from "./plugins/vuetify";
import MasonryWall from "@yeger/vue-masonry-wall";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueApexCharts from "vue3-apexcharts";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import "@/styles/main.scss";
import router from "./router";
import i18n from "./plugins/i18n";
import "vue3-lottie/dist/style.css";
import Vue3Lottie from "vue3-lottie";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入插件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue-advanced-cropper/dist/style.css';//导入样式

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(PerfectScrollbar);
app.use(MasonryWall);
app.use(VueVirtualScroller);
app.use(VueApexCharts);
app.use(i18n);
app.use(Vue3Lottie, { name: "LottieAnimation" });
app.use(autoAnimatePlugin);
app.use(vuetify);
app.use(ElementPlus)

app.mount("#app");

