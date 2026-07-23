<script setup lang="ts">
/**
 * ParticleBackground.vue
 * 渐变慧光（Aurora Halo）背景动画
 *
 * 设计哲学：以几团柔和的径向光晕在画布上缓慢漂浮、呼吸、互相渗透，
 * 形成宁静而专业的氛围。摒弃粒子的离散感，用连续的色光场营造空间深度。
 *
 * 视觉特征：
 * - 浅色调，与米色背景自然融合（不喧宾夺主）
 * - 颜色克制：暖琥珀、淡粉、淡青、淡紫，低饱和度
 * - 缓动而非线性，避免机械感
 * - 鼠标轻柔影响光晕位置，形成微妙交互
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let width = 0
let height = 0
let dpr = 1

// ---- 光晕参数（经过反复调试的"克制"配置） ----
interface Orb {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  baseRadius: number
  // 漂移相位与频率
  phaseX: number
  phaseY: number
  freqX: number
  freqY: number
  driftAmpX: number
  driftAmpY: number
  // 呼吸
  breathPhase: number
  breathFreq: number
  breathAmp: number
  // 颜色（RGB）
  color: { r: number; g: number; b: number }
  // 整体透明度
  alpha: number
}

let orbs: Orb[] = []
let time = 0
const mouse = { x: -9999, y: -9999, active: false }

// 浅色调色板（低饱和度，与米色主题和谐）
const PALETTE = [
  { r: 200, g: 132, b: 60 },   // 暖琥珀
  { r: 226, g: 164, b: 94 },   // 浅琥珀
  { r: 184, g: 113, b: 110 },  // 暖玫瑰
  { r: 122, g: 141, b: 106 },  // 鼠尾草绿
  { r: 90, g: 114, b: 135 },   // 冷板岩蓝
  { r: 168, g: 140, b: 175 }   // 淡薰衣草
]

function initOrbs() {
  // 根据屏幕大小决定光晕数量与尺寸
  const area = width * height
  const count = Math.max(4, Math.min(7, Math.floor(area / 380000)))

  orbs = []
  for (let i = 0; i < count; i++) {
    const color = PALETTE[i % PALETTE.length]
    const baseRadius = Math.max(width, height) * (0.32 + Math.random() * 0.18)
    orbs.push({
      x: 0,
      y: 0,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      radius: baseRadius,
      baseRadius,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      freqX: 0.00018 + Math.random() * 0.00022,
      freqY: 0.00020 + Math.random() * 0.00024,
      driftAmpX: width * (0.08 + Math.random() * 0.10),
      driftAmpY: height * (0.08 + Math.random() * 0.10),
      breathPhase: Math.random() * Math.PI * 2,
      breathFreq: 0.0004 + Math.random() * 0.0006,
      breathAmp: baseRadius * 0.12,
      color,
      alpha: 0.22 + Math.random() * 0.10
    })
  }
}

function resize() {
  if (!canvas.value) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  initOrbs()
}

// 缓动函数：让运动更柔和
function easeInOut(t: number): number {
  return 0.5 - 0.5 * Math.cos(t * Math.PI)
}

function draw() {
  if (!ctx) return
  time += 16 // 约一帧 16ms

  // 用半透明米色覆盖以制造柔和的拖尾感（极轻）
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'rgba(251, 246, 238, 1)'
  ctx.fillRect(0, 0, width, height)

  // 用 lighter 混合模式让光晕叠加产生柔和的色彩相加
  ctx.globalCompositeOperation = 'lighter'

  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i]

    // 漂移：基于正弦的缓动
    const driftX = Math.sin(time * orb.freqX + orb.phaseX) * orb.driftAmpX
    const driftY = Math.cos(time * orb.freqY + orb.phaseY) * orb.driftAmpY

    // 鼠标轻柔影响（仅当鼠标在屏幕内）
    let mouseOffsetX = 0
    let mouseOffsetY = 0
    if (mouse.active) {
      const dx = orb.baseX - mouse.x
      const dy = orb.baseY - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist / (Math.max(width, height) * 0.6))
      // 鼠标会轻微"推开"光晕
      mouseOffsetX = (dx / (dist + 1)) * influence * 30
      mouseOffsetY = (dy / (dist + 1)) * influence * 30
    }

    orb.x = orb.baseX + driftX + mouseOffsetX
    orb.y = orb.baseY + driftY + mouseOffsetY

    // 呼吸：半径周期性变化
    const breath = Math.sin(time * orb.breathFreq + orb.breathPhase)
    orb.radius = orb.baseRadius + breath * orb.breathAmp

    // 绘制径向渐变光晕
    const grad = ctx.createRadialGradient(
      orb.x,
      orb.y,
      0,
      orb.x,
      orb.y,
      orb.radius
    )
    const { r, g, b } = orb.color
    // 中心高亮 → 中段柔和 → 边缘完全透明
    const centerAlpha = orb.alpha
    const midAlpha = orb.alpha * 0.35
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${centerAlpha})`)
    grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${midAlpha})`)
    grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${orb.alpha * 0.08})`)
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalCompositeOperation = 'source-over'
  rafId = requestAnimationFrame(draw)
}

function handleMouseMove(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.active = true
}

function handleMouseLeave() {
  mouse.active = false
  mouse.x = -9999
  mouse.y = -9999
}

function handleVisibility() {
  if (document.hidden) {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  } else {
    if (!rafId) {
      rafId = requestAnimationFrame(draw)
    }
  }
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d', { alpha: false })
  if (!ctx) return
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseout', handleMouseLeave)
  document.addEventListener('visibilitychange', handleVisibility)
  rafId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseout', handleMouseLeave)
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<template>
  <canvas ref="canvas" class="nikan-particle-canvas" aria-hidden="true"></canvas>
</template>
