<template>
  <div class="player-panel">
    <div id="player" ref="playerRef" class="player-style" :style="{ height: playerHeight + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { mitter } from '@/eventbus/eventBus'
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import Hls from 'hls.js'
import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import { getVideoResource } from '@/api/file'

const props = defineProps<{ fileId?: string; autoplay?: boolean }>()

const playerRef = ref<HTMLDivElement | null>(null)
const playerHeight = ref<number>(480)
let player: any = null

const playIcon = new URL('../assets/play.svg', import.meta.url).href

const initPlayer = () => {
  ;(Artplayer as any).CONTEXTMENU = false
  ;(Artplayer as any).AUTO_PLAYBACK_MAX = 20
  ;(Artplayer as any).AUTO_PLAYBACK_MIN = 10

  player = new (Artplayer as any)({
    container: playerRef.value,
    url: '',
    type: 'm3u8',
    customType: {
      m3u8: function (video: HTMLVideoElement, url: string, art: any) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy()
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          art.hls = hls
          art.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          art.notice.show = '浏览器不支持该播放器'
        }
      }
    },
    theme: '#23ade5',
    volume: 0.7,
    autoplay: props.autoplay ?? true,
    autoMini: true,
    fullscreen: true,
    fullscreenWeb: true,
    setting: true,
    pip: true,
    playbackRate: true,
    flip: true,
    aspectRatio: true,
    screenshot: true,
    autoPlayback: true,
    icons: { state: `<img src="${playIcon}">` },
    plugins: [
      artplayerPluginDanmuku({
        danmuku: [],
        speed: 5,
        opacity: 1,
        fontSize: 25,
        color: '#FFFFFF',
        mode: 0,
        margin: [10, '25%']
      } as any)
    ]
  })
}

const switchTo = (fileId: string) => {
  const url = getVideoResource(fileId)
  if (!player) return
  if (typeof player.switchUrl === 'function') player.switchUrl(url, 'm3u8')
  else player.url = url
}

const showPlayer = (height: number) => {
  playerHeight.value = height
  initPlayer()
}

const destroyPlayer = () => { if (player) player.destroy(false) }
defineExpose({ showPlayer, destroyPlayer })

onMounted(() => {
  mitter.on('changeP', (fileId) => switchTo(String(fileId)))
})
onBeforeUnmount(() => {})
onUnmounted(() => { mitter.off('changeP'); destroyPlayer() })
</script>

<style lang="scss" scoped>
.player-panel {
  .player-style {
    width: 100%;
    :deep(.art-video-player.art-mask-show .art-state) {
      position: absolute;
      right: 40px;
      bottom: 70px;
      .art-icon-state { width: 60px; height: 60px; img { width: 100%; } }
    }
    :deep(.art-controls-right) {
      position: relative; display: block; width: 280px;
      .art-control { position: absolute; }
      .art-control-screenshot { left: 0px; }
      .art-control-setting { left: 46px; }
      .art-control-pip { left: 92px; }
      .art-control-wide-screen, .art-control-narrow-screen { left: 138px; }
      .art-control-wide-screen .iconfont, .art-control-narrow-screen .iconfont { font-size: 20px; }
      .art-control-fullscreenWeb { left: 184px; }
      .art-control-fullscreen { left: 230px; }
    }
  }
}
</style>
