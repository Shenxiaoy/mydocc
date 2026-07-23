<script setup lang="ts">
/**
 * FeatureCard.vue
 * 功能卡片导航组件
 *
 * 用于首页的功能模块导航。卡片采用克制的玻璃质感与
 * 琥珀色悬停高光，与粒子背景共同构成轻盈的视觉层次。
 */
import { computed } from 'vue'

interface Props {
  title: string
  description?: string
  link: string
  icon?: string
  accent?: string  // 自定义强调色（覆盖默认琥珀色）
  badge?: string   // 角标徽章文本
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  icon: '',
  accent: '',
  badge: ''
})

// 内置图标集（SVG path）
const ICONS: Record<string, string> = {
  ai: 'M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z M19 17L19.7 19.3L22 20L19.7 20.7L19 23L18.3 20.7L16 20L18.3 19.3L19 17Z M5 14L5.5 15.5L7 16L5.5 16.5L5 18L4.5 16.5L3 16L4.5 15.5L5 14Z',
  diary: 'M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z M5 3V21 M8 7H16 M8 11H14 M8 15H12',
  coding: 'M8 9L4 12L8 15 M16 9L20 12L16 15 M14 6L10 18',
  phrases: 'M4 4H20C20.55 4 21 4.45 21 5V16C21 16.55 20.55 17 20 17H13L9 21V17H4C3.45 17 3 16.55 3 16V5C3 4.45 3.45 4 4 4Z M7 8H17 M7 12H13'
}

const iconPath = computed(() => ICONS[props.icon] || '')
const accentColor = computed(() => props.accent || '#c8843c')
</script>

<template>
  <a
    :href="link"
    class="feature-card"
    :style="{ '--card-accent': accentColor }"
  >
    <div v-if="badge" class="fc-badge">{{ badge }}</div>
    <div v-if="iconPath" class="fc-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path :d="iconPath" />
      </svg>
    </div>
    <div class="fc-content">
      <h3 class="fc-title">{{ title }}</h3>
      <p v-if="description" class="fc-desc">{{ description }}</p>
      <span class="fc-link">
        进入
        <svg class="fc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12H19 M13 6L19 12L13 18" />
        </svg>
      </span>
    </div>
  </a>
</template>

<style scoped>
.feature-card {
  position: relative;
  display: block;
  padding: 28px 24px;
  background: rgba(251, 246, 238, 0.65);
  border: 1px solid rgba(230, 220, 200, 0.7);
  border-radius: 16px;
  text-decoration: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
              border-color 0.3s ease;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
}

:global(.dark) .feature-card {
  background: rgba(34, 29, 23, 0.6);
  border: 1px solid rgba(42, 35, 27, 0.8);
}

/* 顶部琥珀色高光线 */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

/* 右上角光晕 */
.feature-card::after {
  content: '';
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--card-accent) 18%, transparent) 0%, transparent 70%);
  top: -50px;
  right: -50px;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-accent);
  box-shadow: 0 4px 12px rgba(74, 60, 35, 0.06),
              0 12px 32px rgba(74, 60, 35, 0.08);
}

.feature-card:hover::before,
.feature-card:hover::after {
  opacity: 1;
}

.fc-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--card-accent);
  background: color-mix(in srgb, var(--card-accent) 14%, transparent);
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 500;
}

.fc-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--card-accent) 14%, transparent);
  border-radius: 12px;
  margin-bottom: 16px;
  color: var(--card-accent);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.feature-card:hover .fc-icon {
  transform: scale(1.08) rotate(-3deg);
}

.fc-icon svg {
  width: 22px;
  height: 22px;
}

.fc-content {
  position: relative;
}

.fc-title {
  font-family: var(--nikan-font-display, serif);
  font-weight: 600;
  font-size: 19px;
  color: var(--nikan-ink, #2a2520);
  margin: 0 0 8px;
  letter-spacing: 0.01em;
}

:global(.dark) .fc-title {
  color: var(--nikan-ink, #ebe3d3);
}

.fc-desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--nikan-ink-soft, #5c534a);
  margin: 0 0 14px;
}

:global(.dark) .fc-desc {
  color: var(--nikan-ink-soft, #b3a896);
}

.fc-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--card-accent);
  font-weight: 500;
  font-size: 13px;
  transition: gap 0.3s ease;
}

.feature-card:hover .fc-link {
  gap: 8px;
}

.fc-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.feature-card:hover .fc-arrow {
  transform: translateX(2px);
}
</style>
