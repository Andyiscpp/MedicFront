<template>
  <v-container>
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey-darken-1">视频资源加载中...</p>
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      title="视频加载失败"
      :text="error"
      variant="tonal"
      class="my-5"
    >
      <template v-slot:append>
        <v-btn @click="router.back()" color="error">返回列表</v-btn>
      </template>
    </v-alert>

    <v-card v-else-if="videoItem" rounded="lg">
      <v-responsive :aspect-ratio="16/9">
        <video
          v-if="videoItem.videoUrl"
          :src="videoItem.videoUrl"
          controls
          class="w-100 h-100"
          :poster="videoItem.coverUrl || ''"
        >
          您的浏览器不支持 Video 标签。
        </video>
        <div v-else class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
          <p class="text-h6 text-grey">视频地址无效</p>
        </div>
      </v-responsive>

      <v-divider></v-divider>

      <v-card-title class="text-h5 pt-4">
        {{ videoItem.title }}
      </v-card-title>
      
      <v-card-subtitle class="d-flex align-center flex-wrap">
        <v-icon size="small" class="mr-1">mdi-account-circle</v-icon>
        <span>{{ videoItem.uploaderName }}</span>
        <v-spacer></v-spacer>
        <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
        <span>发布于: {{ new Date(videoItem.createdAt).toLocaleDateString() }}</span>
      </v-card-subtitle>

      <v-card-text class="py-4">
        <p class="text-body-1">{{ videoItem.description }}</p>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn @click="shareVideo" color="primary" prepend-icon="mdi-share-variant">
          分享
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="router.back()" variant="text">
          返回列表
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSnackbarStore } from '@/stores/snackbarStore'; // 假设用于提示

// --- 数据接口 ---
interface VideoDetailData {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  coverUrl: string | null;
  uploaderName: string;
  createdAt: string;
}

// --- setup ---
const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();

const videoItem = ref<VideoDetailData | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// --- 方法 ---
const fetchVideoDetail = async () => {
  const videoId = route.params.id;
  loading.value = true;
  error.value = null;

  try {
    // 假设后端存在一个 /api/videos/{id} 的接口，你需要确保它存在
    // 如果不存在，你需要让后端同学创建一个，它应该返回单个视频的详细信息
    // 这里我们先模拟这个请求
    const response = await fetch(`/api/videos/${videoId}`); // 这个需要后端实现
    if (!response.ok) throw new Error('网络错误或视频不存在。');

    const result = await response.json();
    if (result.code === 20000 && result.data) {
      videoItem.value = result.data;
    } else {
      throw new Error(result.msg || '无法加载视频数据');
    }
  } catch (err: any) {
    error.value = err.message || '请求失败，请稍后重试。';
    snackbarStore.showErrorMessage(error.value);
  } finally {
    loading.value = false;
  }
};

const shareVideo = async () => {
  if (!videoItem.value) return;
  const shareData = {
    title: videoItem.value.title,
    text: `来看看这个教学视频: ${videoItem.value.title}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      snackbarStore.showSuccessMessage('页面链接已复制到剪贴板');
    }
  } catch (err) {
    console.error('分享失败:', err);
    snackbarStore.showErrorMessage('分享失败');
  }
};

// --- 生命周期 ---
onMounted(() => {
  fetchVideoDetail();
});
</script>

<style scoped>
.v-container {
  max-width: 1000px;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
video {
  background-color: #000; /* 为视频播放器提供黑色背景 */
}
</style>