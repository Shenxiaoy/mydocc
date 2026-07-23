# AI 概览

> 这是一段由 `MarkdownPreview` 组件通过接口 `/mock/ai-overview.md` 实时获取并渲染的内容，用于演示组件工作流程。

## 什么是大语言模型

大语言模型（LLM）是一种基于** Transformer 架构**的神经网络，通过在海量文本上预训练，学会预测下一个 token 的概率分布。它并不"理解"世界，但能以惊人的连贯性复述、组合、推理它见过的语言模式。

## 核心概念

- **Token**：模型处理的最小语义单元，介于"字"与"词"之间
- **Context Window**：模型一次能"看见"的最大 token 数
- **Temperature**：采样温度，越高越发散，越低越确定
- **Embedding**：把文本映射为高维向量，捕捉语义相似性

## 一段示例代码

```javascript
async function chat(prompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, temperature: 0.7 })
  })
  return (await res.json()).reply
}
```

## 思考方式

| 维度 | 提问 | 落点 |
| --- | --- | --- |
| 边界 | 模型能做什么、不能做什么 | 减少不切实际的期望 |
| 成本 | 单次调用的 token 与延迟 | 在效果与开销间权衡 |
| 评估 | 如何知道输出是好的 | 建立可复用的评测集 |

> 与其追问"AI 是否会取代我们"，不如问"我们如何与 AI 共同思考"。
