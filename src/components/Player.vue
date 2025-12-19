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
import { abrPlaylistUrl } from '@/api/abr'
import { issueEncToken, encMasterUrl, encPlaylistUrl } from '@/api/enc'

const props = defineProps<{ fileId?: string; filePostId?: number; autoplay?: boolean }>()

const playerRef = ref<HTMLDivElement | null>(null)
const playerHeight = ref<number>(480)
let player: any = null
let currentQualityList: { html: string; url: string; default?: boolean }[] = []
let currentToken: string | null = null
let currentMasterObjectUrl: string | null = null
let levelIndexByName: Record<string, number> = {}
let currentAutoLabel = '自动'

const playIcon = new URL('../assets/play.svg', import.meta.url).href

const appendTokenParam = (url: string) => {
  if (!currentToken) return url
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.pathname.startsWith('/video/enc/')) {
      // 走本地代理转发到 /admin
      parsed.pathname = `/api${parsed.pathname}`
    }
    parsed.searchParams.set('token', currentToken)
    return parsed.toString()
  } catch (_) {
    return url
  }
}

const initPlayer = (defaultUrl: string, qualityList: { html: string; url: string; default?: boolean }[]) => {
  levelIndexByName = {}
  currentAutoLabel = '自动'
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
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            levelIndexByName = {}
            hls.levels.forEach((lv: any, idx: number) => {
              const name = lv.name || lv.attrs?.['NAME'] || (lv.height ? `${lv.height}p` : undefined)
              if (name) levelIndexByName[name] = idx
            })
          })
          hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
            const lv = hls.levels?.[data.level]
            if (lv) {
              const name = lv.name || lv.attrs?.['NAME'] || (lv.height ? `${lv.height}p` : '')
              currentAutoLabel = name ? `自动(${name})` : '自动'
              updateAutoLabel()
            }
          })
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

  player.on('quality', (item: any) => {
    const hls = player?.hls
    if (!hls) return
    if (item.html.startsWith('自动')) {
      hls.autoLevelEnabled = true
      hls.currentLevel = -1
      hls.loadLevel = -1
      hls.nextLevel = -1
      return
    }
    const idx = levelIndexByName[item.html]
    if (typeof idx === 'number') {
      hls.autoLevelEnabled = false
      hls.currentLevel = idx
      hls.loadLevel = idx
      hls.nextLevel = idx
      currentAutoLabel = '自动'
      updateAutoLabel()
    }
  })
}

const switchTo = async (fileId: string | number) => {
  // 先申请播放 token，再根据授权清晰度构造 master + 档位 URL
  const tokenResp = await issueEncToken(fileId)
  currentToken = tokenResp.token
  const allowedQualities = parseAllowedQualities(tokenResp.allowedQualities)

  const masterUrl = encMasterUrl(fileId, currentToken)
  const encVariants = await loadEncMasterVariants(masterUrl)
  const variantResp = await fetchAbrVariants(fileId)
  const allQualities = variantResp.qualities || []

  const variants = buildVariantEntries(fileId, allQualities, encVariants, allowedQualities)
  const masterText = buildMasterPlaylist(variants)
  cleanupMasterUrl()
  currentMasterObjectUrl = masterText ? URL.createObjectURL(new Blob([masterText], { type: 'application/vnd.apple.mpegurl' })) : ''

  currentQualityList = buildQualityList(variants, currentMasterObjectUrl || masterUrl)
  const defaultUrl = currentMasterObjectUrl || masterUrl || ''
  if (player) {
    player.destroy(false)
  }
  initPlayer(defaultUrl, currentQualityList)
}

const loadEncMasterVariants = async (masterUrl: string): Promise<string[]> => {
  try {
    const res = await fetch(masterUrl)
    if (!res.ok) return []
    const text = await res.text()
    const variants = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.replace(/\/index\.m3u8$/, ''))
    return Array.from(new Set(variants))
  } catch (e) {
    console.warn('parse enc master failed', e)
    return []
  }
}

type VariantEntry = {
  quality: string
  url: string
  bandwidth?: number
  width?: number
  height?: number
}

const buildVariantEntries = (fileId: string | number, qualities: string[], encVariants: string[], allowed: string[] | null): VariantEntry[] => {
  const weighted = (
    qualities
      .map((q) => q?.trim())
      .filter(Boolean) as string[]
  ).sort((a, b) => qualityWeight(b) - qualityWeight(a))
  const encSet = new Set(encVariants)
  const allowedSet = allowed ? new Set(allowed) : null
  return weighted
    .filter((q) => !allowedSet || allowedSet.has(q))
    .map((q) => {
      const meta = qualityMeta[q] || {}
      const useEnc = !!currentToken && encSet.has(q)
      const url = useEnc ? encPlaylistUrl(fileId, q, currentToken || '') : abrPlaylistUrl(fileId, q)
      return { quality: q, url, bandwidth: meta.bandwidth, width: meta.width, height: meta.height }
    })
}

const buildQualityList = (variants: VariantEntry[], masterUrl: string) => {
  const list = variants.map((v) => ({
    html: v.quality,
    url: masterUrl,
    default: false
  }))
  const autoUrl = masterUrl || list[0]?.url || ''
  if (list[0]) {
    list[0].default = true
  }
  return autoUrl
    ? [{ html: currentAutoLabel, url: autoUrl, default: true }, ...list]
    : list
}

const qualityWeight = (q: string): number => {
  const map: Record<string, number> = { '1080p': 1080, '720p': 720, '480p': 480, '360p': 360 }
  return map[q] ?? 0
}

const qualityMeta: Record<string, { width: number; height: number; bandwidth: number }> = {
  '1080p': { width: 1920, height: 1080, bandwidth: 5_000_000 },
  '720p': { width: 1280, height: 720, bandwidth: 3_000_000 },
  '480p': { width: 854, height: 480, bandwidth: 1_500_000 },
  '360p': { width: 640, height: 360, bandwidth: 900_000 }
}

const buildMasterPlaylist = (variants: VariantEntry[]): string => {
  if (!variants.length) return ''
  const lines = ['#EXTM3U', '#EXT-X-VERSION:3', '#EXT-X-INDEPENDENT-SEGMENTS']
  variants.forEach((v) => {
    const bw = v.bandwidth ?? Math.max(400_000, qualityWeight(v.quality) * 8_000)
    const res = v.width && v.height ? `,RESOLUTION=${v.width}x${v.height}` : ''
    lines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${bw}${res},NAME="${v.quality}"`)
    lines.push(v.url)
  })
  return lines.join('\n')
}

const parseAllowedQualities = (json?: string | null): string[] | null => {
  if (!json) return null
  try {
    const arr = JSON.parse(json)
    return Array.isArray(arr) ? arr.filter((q) => typeof q === 'string') : null
  } catch (_) {
    return null
  }
}

const updateAutoLabel = () => {
  if (!player) return
  const qualityList = player?.option?.quality || []
  const updated = qualityList.map((q: any) => (q.default ? { ...q, html: currentAutoLabel } : q))
  player.switchQuality(updated.find((q: any) => q.default), true)
}

const cleanupMasterUrl = () => {
  if (currentMasterObjectUrl) {
    URL.revokeObjectURL(currentMasterObjectUrl)
    currentMasterObjectUrl = null
  }
}

const showPlayer = (height: number) => {
  playerHeight.value = height
}

const destroyPlayer = () => {
  if (player) player.destroy(false)
  cleanupMasterUrl()
}
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
