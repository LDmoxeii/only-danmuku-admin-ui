<template>
  <div class="image-panel" :style="{ width: width + 'px', height: width + 'px' }">
    <router-link v-if="userId" :to="`/user/${userId}`" target="_blank">
      <Cover :lazy="lazy" :width="width" :source="avatar" :defaultImg="defaultAvatar" borderRadius="50%" :scale="1" />
    </router-link>
    <Cover v-else :lazy="lazy" :width="width" :source="avatar" :defaultImg="defaultAvatar" borderRadius="50%" :scale="1" />
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'
import Cover from '@/components/Cover.vue'

const defaultAvatar = ref('user.png')
withDefaults(
  defineProps<{
    width?: number
    avatar?: string
    userId?: string | number
    lazy?: boolean
  }>(),
  {
    width: 50,
    lazy: true
  }
)
</script>

<style lang="scss" scoped>
</style>

