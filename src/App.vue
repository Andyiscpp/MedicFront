<template>
  <v-app>
    <component :is="currentLayout" v-if="isRouterLoaded">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </component>

    <RepaireCard />
    <CustomizationMenu />
    <BackToTop />
    <Snackbar />
  </v-app>
</template>

<script setup lang="ts">
//图标库
import { Icon } from "@iconify/vue";

import UILayout from "@/layouts/UILayout.vue";
import LandingLayout from "@/layouts/LandingLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import CustomizationMenu from "@/components/CustomizationMenu.vue";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import BackToTop from "@/components/common/BackToTop.vue";
import Snackbar from "@/components/common/Snackbar.vue";
//主题
import { useTheme } from "vuetify";
const theme = useTheme();
import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
// live2d
import Live2d from "@/components/Live2d.vue";
import { useProfileStore } from "@/stores/profileStore";
const customizeTheme = useCustomizeThemeStore();
const route = useRoute();

const isRouterLoaded = computed(() => {
  if (route.name !== null) return true;
  return false;
});

const layouts = {
  default: DefaultLayout,
  ui: UILayout,
  landing: LandingLayout,
  auth: AuthLayout,
};

type LayoutName = "default" | "ui" | "landing" | "auth" | "error";

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as LayoutName;
  if (!layoutName) {
    return DefaultLayout;
  }
  return layouts[layoutName];
});
onMounted(() => {
  theme.global.name.value = appStore.theme;
  const profileStore = useProfileStore();
  profileStore.fetchUserProfile();
});
</script>

<style scoped>
.global-fix-card {
  position: fixed;
  top: 70px; /* 位于 AppBar 下方 */
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  z-index: 1000; /* 确保在最上层 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>