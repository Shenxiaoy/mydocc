# 编程概览

> 这段内容由接口 `/mock/coding-overview.md` 提供，演示 `MarkdownPreview` 组件渲染代码与表格的能力。

## 编程的三种姿态

- **写**——把想法翻译成机器能执行的语言
- **读**——读懂别人写的，也读懂过去的自己
- **改**——在已有的代码上做减法或加法

## 一段 Vue 3 组合式 API 示例

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }} × 2 = {{ doubled }}</button>
</template>
```

## 常用工具对比

| 工具 | 类型 | 适用场景 |
| --- | --- | --- |
| Vite | 构建工具 | 现代前端项目首选 |
| Vue 3 | 框架 | 渐进式、组合式 API |
| VitePress | 文档工具 | 文档站、博客 |
| Node.js | 运行时 | 服务端、工具链 |

## 一条经验

> 调试比写代码更耗时。给自己留出"读代码"的时间，比多写一段功能更划算。
