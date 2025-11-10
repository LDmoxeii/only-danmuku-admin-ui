<template>
  <div class="image-panel" :style="{ width: width + 'px', height: width + 'px' }">
    <router-link v-if="userId" :to="`/user/${userId}`" target="_blank">
      <Cover :source="avatar" :defaultImg="defaultAvatar" borderRadius="50%" />
    </router-link>
    <Cover v-else :source="avatar" :defaultImg="defaultAvatar" borderRadius="50%" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Cover from '@/components/Cover.vue'

const defaultAvatar = ref('user.png')
defineProps<{ width?: number; avatar?: string; userId?: string }>()
</script>

<style lang="scss" scoped>
</style>

