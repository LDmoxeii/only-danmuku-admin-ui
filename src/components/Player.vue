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
import { abrMasterUrl, abrPlaylistUrl, fetchAbrVariants } from '@/api/abr'

const props = defineProps<{ fileId?: string; filePostId?: number; autoplay?: boolean }>()

const playerRef = ref<HTMLDivElement | null>(null)
const playerHeight = ref<number>(480)
let player: any = null
let currentQualityList: { html: string; url: string; default?: boolean }[] = []
const AUTO_QUALITY_LABEL = '自动'
const formatAutoQualityLabel = (level?: { height?: number; name?: string } | null) => {
  if (!level) return AUTO_QUALITY_LABEL
  if (level.height) return `${AUTO_QUALITY_LABEL} (${level.height}p)`
  if (level.name) return `${AUTO_QUALITY_LABEL} (${level.name})`
  return AUTO_QUALITY_LABEL
}
const updateAutoQualityLabel = (label: string) => {
  if (!currentQualityList.length) return
  const autoItem = currentQualityList[0]
  if (!autoItem?.default) return
  const autoItemAny = autoItem as any
  if (autoItemAny.$control_item && autoItemAny.$control_item.innerHTML !== label) {
    autoItemAny.$control_item.innerHTML = label
  }
  if (autoItemAny.$control_value && autoItemAny.$control_value.innerHTML !== AUTO_QUALITY_LABEL) {
    autoItemAny.$control_value.innerHTML = AUTO_QUALITY_LABEL
  }
}

const playIcon = new URL('../assets/play.svg', import.meta.url).href

const initPlayer = (defaultUrl: string, qualityList: { html: string; url: string; default?: boolean }[]) => {
  ;(Artplayer as any).CONTEXTMENU = false
  ;(Artplayer as any).AUTO_PLAYBACK_MAX = 20
  ;(Artplayer as any).AUTO_PLAYBACK_MIN = 10

  player = new (Artplayer as any)({
    container: playerRef.value,
    url: defaultUrl,
    type: 'm3u8',
    customType: {
      m3u8: function (video: HTMLVideoElement, url: string, art: any) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy()
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
            if (!currentQualityList[0]?.default) return
            const level = hls.levels?.[data.level]
            updateAutoQualityLabel(formatAutoQualityLabel(level))
          })
          art.hls = hls
          art.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          art.notice.show = '浏览器不支持该播放器'
        }
      }
    },
    quality: qualityList,
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
    icons: { state: `<img src="${playIcon}" alt="">` },
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

const switchTo = async (fileId: string | number) => {
  // 拉取档位并构造 master + 手动档位
  const variantResp = await fetchAbrVariants(fileId)
  currentQualityList = [
    { html: '自动', url: abrMasterUrl(fileId), default: true },
    ...(variantResp.qualities || []).map((q: string) => ({
      html: q,
      url: abrPlaylistUrl(fileId, q)
    }))
  ]
  const defaultUrl = currentQualityList[0]?.url || ''
  if (player) {
    player.destroy(false)
  }
  initPlayer(defaultUrl, currentQualityList)
}

const showPlayer = (height: number) => {
  playerHeight.value = height
}

const destroyPlayer = () => { if (player) player.destroy(false) }
defineExpose({ showPlayer, destroyPlayer })

onMounted(() => {
  mitter.on('changeP', (filePostId: any) => {
    switchTo(String(filePostId)).catch((err) => console.error(err))
  })
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
      position: relative;
      display: block;
      width: 330px;
      .art-control { position: absolute; }
      .art-control-screenshot { left: 0; }
      .art-control-quality { left: 48px; }
      .art-control-setting { left: 96px; }
      .art-control-pip { left: 144px; }
      .art-control-wide-screen, .art-control-narrow-screen { left: 192px; }
      .art-control-wide-screen .iconfont, .art-control-narrow-screen .iconfont { font-size: 20px; }
      .art-control-fullscreenWeb { left: 240px; }
      .art-control-fullscreen { left: 288px; }
    }
  }
}
</style>
