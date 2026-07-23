import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'

import ParticleBackground from './components/ParticleBackground.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'
import FeatureCard from './components/FeatureCard.vue'
import AiPrompt from './components/ai/imgPrompt.vue'

import './style.css'

// 扩展默认主题：注入粒子背景与自定义组件
const nikanTheme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在布局背景层注入粒子动画
      'layout-bottom': () => h(ParticleBackground)
    })
  },
  enhanceApp({ app }) {
    // 注册全局自定义组件
    app.component('MarkdownPreview', MarkdownPreview)
    app.component('FeatureCard', FeatureCard)
    app.component('ParticleBackground', ParticleBackground)
    app.component('AiPrompt', AiPrompt)
  }
}

export default nikanTheme
