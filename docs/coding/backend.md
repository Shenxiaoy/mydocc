---
title: 后端
titleTemplate: 尼看 · 编程 · 后端
---

# 后端

Node.js、接口与服务端实践。

## 一个最小的 Markdown 接口

若要让 `MarkdownPreview` 组件从真实接口获取数据，后端可以这样实现：

```javascript
// Node.js + Express 示例
import express from 'express'
const app = express()

app.get('/api/markdown/:id', async (req, res) => {
  const { id } = req.params
  const content = await loadMarkdownById(id)
  res.type('text/markdown').send(content)
})

app.listen(3000)
```

## 返回格式约定

`MarkdownPreview` 组件兼容两种返回格式：

1. **纯文本**（推荐）：`Content-Type: text/markdown`，直接返回 markdown 原文
2. **JSON 包裹**：`Content-Type: application/json`，形如：
   ```json
   { "data": { "content": "# Hello\n\n这是正文" } }
   ```

## 鉴权

若接口需要鉴权，通过 `headers` 属性传入：

```vue
<MarkdownPreview
  src="/api/notes/private"
  :headers="{ Authorization: 'Bearer xxx' }"
/>
```
