---
title: 前端
titleTemplate: 尼看 · 编程 · 前端
---

# 前端

Vue、VitePress、CSS 与浏览器那些事。

## VitePress 自定义主题

VitePress 通过 `.vitepress/theme/index.ts` 扩展默认主题：

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import MyComponent from './MyComponent.vue'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-bottom': () => h(MyComponent)
  }),
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}

export default theme
```

## 在 Markdown 中使用组件

VitePress 允许在 `.md` 文件中直接使用全局注册的 Vue 组件：

```markdown
<MarkdownPreview src="/api/notes/abc" />
```

若组件依赖浏览器 API，需用 `<ClientOnly>` 包裹：

```markdown
<ClientOnly>
  <CanvasAnimation />
</ClientOnly>
```
