<script setup lang="ts">
/**
 * MarkdownPreview.vue
 * 自定义 Markdown 预览组件
 *
 * 功能：
 * 1. 通过接口获取 Markdown 数据并渲染
 * 2. 也支持直接传入 raw Markdown 字符串
 * 3. 加载中 / 错误 / 空状态友好提示
 * 4. 使用 markdown-it 进行渲染，并安全地注入到 DOM
 *
 * 用法：
 *   <MarkdownPreview src="/api/markdown/abc" />
 *   <MarkdownPreview src="https://example.com/notes.md" />
 *   <MarkdownPreview raw="# Hello World" />
 */
import { ref, watch, onMounted, computed } from 'vue'
import MarkdownIt from 'markdown-it'

interface Props {
  // 接口地址：组件将 GET 该地址，期望返回 markdown 文本
  src?: string
  // 直接传入的 markdown 文本（与 src 二选一）
  raw?: string
  // 请求时携带的 headers
  headers?: Record<string, string>
  // 是否在挂载时自动加载（默认 true）
  autoLoad?: boolean
  // 自定义类名
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  raw: '',
  headers: () => ({}),
  autoLoad: true,
  wrapperClass: ''
})

const emit = defineEmits<{
  (e: 'loaded', markdown: string): void
  (e: 'error', err: Error): void
}>()

// 初始化 markdown-it 实例
const md = new MarkdownIt({
  html: false,        // 禁止内嵌 HTML，保证安全
  linkify: true,      // 自动识别链接
  typographer: true,  // 排版美化（智能引号等）
  breaks: true        // 换行转 <br>
})

// 简单的目标属性处理：外部链接新窗口打开
const defaultLinkOpen = md.renderer.rules.link_open || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const aIndex = token.attrIndex('target')
  if (aIndex < 0) {
    token.attrPush(['target', '_blank'])
    token.attrPush(['rel', 'noopener noreferrer'])
  } else {
    tokens[idx].attrs![aIndex][1] = '_blank'
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

type Status = 'idle' | 'loading' | 'success' | 'error'
const status = ref<Status>('idle')
const errorMessage = ref('')
const renderedHtml = ref('')
const rawContent = ref('')

const isLoading = computed(() => status.value === 'loading')
const isError = computed(() => status.value === 'error')
const isEmpty = computed(
  () => status.value === 'success' && !renderedHtml.value.trim()
)

async function fetchMarkdown(url: string) {
  if (!url) {
    status.value = 'idle'
    return
  }
  status.value = 'loading'
  errorMessage.value = ''
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/markdown, text/plain, */*',
        ...props.headers
      }
    })
    if (!response.ok) {
      throw new Error(`请求失败：HTTP ${response.status} ${response.statusText}`)
    }
    const contentType = response.headers.get('content-type') || ''
    const text = await response.text()

    // 若接口返回 JSON（如 { data: { content: "..." } }），尝试解析
    if (contentType.includes('application/json')) {
      try {
        const json = JSON.parse(text)
        // 兼容多种常见字段
        const content =
          json?.data?.content ??
          json?.data?.markdown ??
          json?.content ??
          json?.markdown ??
          ''
        rawContent.value = typeof content === 'string' ? content : ''
      } catch {
        rawContent.value = text
      }
    } else {
      rawContent.value = text
    }

    renderedHtml.value = md.render(rawContent.value || '')
    status.value = 'success'
    emit('loaded', rawContent.value)
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err))
    errorMessage.value = e.message || '未知错误'
    status.value = 'error'
    emit('error', e)
  }
}

function renderRaw(text: string) {
  rawContent.value = text
  renderedHtml.value = md.render(text || '')
  status.value = text ? 'success' : 'idle'
}

function reload() {
  if (props.src) {
    fetchMarkdown(props.src)
  } else if (props.raw) {
    renderRaw(props.raw)
  }
}

// 暴露方法给父组件
defineExpose({
  reload,
  getRaw: () => rawContent.value,
  getHtml: () => renderedHtml.value
})

watch(
  () => props.src,
  (val) => {
    if (val) fetchMarkdown(val)
  }
)

watch(
  () => props.raw,
  (val) => {
    if (val !== undefined) renderRaw(val)
  }
)

onMounted(() => {
  if (props.autoLoad) {
    if (props.src) {
      fetchMarkdown(props.src)
    } else if (props.raw) {
      renderRaw(props.raw)
    }
  }
})
</script>

<template>
  <div class="markdown-preview" :class="wrapperClass">
    <!-- 加载中 -->
    <div v-if="isLoading" class="mp-loading">
      <span class="mp-spinner"></span>
      <span>正在加载 Markdown...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="isError" class="mp-error">
      <p>加载失败：{{ errorMessage }}</p>
      <button class="mp-retry" @click="reload">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="isEmpty" class="mp-empty">
      <p>暂无内容</p>
    </div>

    <!-- 渲染结果 -->
    <div v-else class="mp-body" v-html="renderedHtml"></div>
  </div>
</template>

<style scoped>
.markdown-preview {
  position: relative;
}

.mp-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--nikan-ink-mute, #8a8074);
  font-family: var(--nikan-font-display, serif);
  font-style: italic;
  padding: 8px 0;
}

.mp-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(200, 132, 60, 0.18);
  border-top-color: #c8843c;
  border-radius: 50%;
  animation: mp-spin 0.9s linear infinite;
  flex-shrink: 0;
}

@keyframes mp-spin {
  to { transform: rotate(360deg); }
}

.mp-error {
  color: #b8716e;
  font-style: italic;
}

.mp-error p {
  margin: 0 0 12px;
}

.mp-retry {
  background: rgba(200, 132, 60, 0.12);
  border: 1px solid rgba(200, 132, 60, 0.4);
  color: #c8843c;
  padding: 6px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.25s ease;
}

.mp-retry:hover {
  background: rgba(200, 132, 60, 0.22);
  border-color: #c8843c;
}

.mp-empty {
  color: var(--nikan-ink-mute, #8a8074);
  font-style: italic;
  text-align: center;
  padding: 24px;
}

.mp-body {
  color: inherit;
}

.mp-body :deep(h1),
.mp-body :deep(h2),
.mp-body :deep(h3) {
  font-family: var(--nikan-font-display, serif);
  color: var(--vp-c-text-1, #2a2520);
  margin: 1.4em 0 0.6em;
  font-weight: 600;
  line-height: 1.3;
}

.mp-body :deep(h1) { font-size: 28px; }
.mp-body :deep(h2) { font-size: 22px; }
.mp-body :deep(h3) { font-size: 18px; }

.mp-body :deep(p) {
  margin: 0.8em 0;
}

.mp-body :deep(a) {
  color: #c8843c;
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: border-color 0.2s ease;
}

.mp-body :deep(a:hover) {
  border-bottom-color: #c8843c;
}

.mp-body :deep(code) {
  font-family: var(--nikan-font-mono, monospace);
  font-size: 0.88em;
  background: rgba(200, 132, 60, 0.18);
  color: #c8843c;
  padding: 2px 6px;
  border-radius: 4px;
}

.mp-body :deep(pre) {
  background: #1a1612;
  color: #ebe3d3;
  padding: 16px 18px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 1em 0;
  font-size: 13.5px;
  line-height: 1.6;
}

.mp-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.mp-body :deep(blockquote) {
  border-left: 3px solid #c8843c;
  padding-left: 16px;
  color: var(--vp-c-text-2, #5c534a);
  margin: 1em 0;
  font-style: italic;
}

.mp-body :deep(ul),
.mp-body :deep(ol) {
  padding-left: 24px;
  margin: 0.8em 0;
}

.mp-body :deep(li) {
  margin: 0.3em 0;
}

.mp-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
}

.mp-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.mp-body :deep(th),
.mp-body :deep(td) {
  border: 1px solid var(--vp-c-divider, #e6dcc8);
  padding: 8px 12px;
  text-align: left;
}

.mp-body :deep(th) {
  background: rgba(200, 132, 60, 0.18);
  font-weight: 600;
}

.mp-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--vp-c-divider, #e6dcc8);
  margin: 1.5em 0;
}
</style>
