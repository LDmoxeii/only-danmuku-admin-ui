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
import { fetchAbrVariants } from '@/api/abr'
import { issueEncToken, encMasterUrl, encPlaylistUrl } from '@/api/enc'

const props = defineProps<{ fileId?: string; filePostId?: number; autoplay?: boolean }>()

const playerRef = ref<HTMLDivElement | null>(null)
const playerHeight = ref<number>(480)
let player: any = null
let currentQualityList: { html: string; url: string; default?: boolean }[] = []
let currentToken: string | null = null

const playIcon = new URL('../assets/play.svg', import.meta.url).href

const appendTokenParam = (url: string) => {
  if (!currentToken) return url
  try {
    const parsed = new URL(url, window.location.href)
    parsed.searchParams.set('token', currentToken)
    return parsed.toString()
  } catch (_) {
    return url
  }
}

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
          const tokenizedLoader: any = (() => {
            const BaseLoader = Hls.DefaultConfig.loader
            return class TokenLoader extends (BaseLoader as any) {
              load(context: any, config: any, callbacks: any) {
                context.url = appendTokenParam(context.url)
                return super.load(context, config, callbacks)
              }
            }
          })()
          const hls = new Hls({ loader: tokenizedLoader as any })
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
  // 先申请播放 token，再根据授权清晰度构造 master + 档位 URL
  const tokenResp = await issueEncToken(fileId)
  currentToken = tokenResp.token

  const allowed = parseAllowed(tokenResp.allowedQualities)
  const variantResp = await fetchAbrVariants(fileId)
  const qualities = filterQualities(variantResp.qualities || [], allowed)

  currentQualityList = [
    { html: '自动', url: encMasterUrl(fileId, currentToken), default: true },
    ...qualities.map((q: string) => ({
      html: q,
      url: encPlaylistUrl(fileId, q, currentToken!)
    }))
  ]
  const defaultUrl = currentQualityList[0]?.url || ''
  if (player) {
    player.destroy(false)
  }
  initPlayer(defaultUrl, currentQualityList)
}

const parseAllowed = (allowed?: string | null): string[] | null => {
  if (!allowed) return null
  try {
    const parsed = JSON.parse(allowed)
    return Array.isArray(parsed) ? parsed : null
  } catch (_) {
    return null
  }
}

const filterQualities = (qualities: string[], allowed: string[] | null): string[] => {
  if (!allowed || allowed.length === 0) return qualities
  return qualities.filter((q) => allowed.includes(q))
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
