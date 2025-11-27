# v3-markdown-stream

一个基于 Vue 3 的高性能 Markdown 流式渲染组件，支持增量输出、无闪屏、无卡顿，样式友好。

[演示地址](https://xhy12345.github.io/ "演示地址")

## 特性

- ✨ **流式输出**：支持增量渲染 Markdown 内容，适用于大文本或流式数据场景
- 🎯 **无闪屏渲染**：每次更新内容时保持平滑过渡，提升用户体验
- 🎨 **样式友好**：内置美观的默认样式，支持自定义主题颜色
- 🚀 **高性能**：使用 Vue 的 computed 缓存和响应式系统优化渲染性能
- 📋 **全面的 Markdown 支持**：
  - GFM (GitHub Flavored Markdown)
  - 代码高亮
  - 数学公式 (KaTeX)
  - 表格
  - 列表
  - 引用块
  - 提示框 (警告、提示、错误)
  - 任务列表
  - 表情符号
  - 原生html标签

## 安装

### NPM / Yarn

```bash
npm install v3-markdown-stream
# 或
yarn add v3-markdown-stream
```

## 基本用法

### 在 Vue 组件中使用

```vue
<template>
  <div>
    <MarkdownRender :markInfo="markdownContent" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MarkdownRender } from 'v3-markdown-stream';
import 'v3-markdown-stream/dist/v3-markdown-stream.css';

// 静态内容
const markdownContent = ref('# Hello World\n\nThis is a simple markdown example.')
</script>
```

## 参数说明

### `markInfo`

- **类型**：`String`
- **必需**：`true`
- **默认值**：`''`
- **描述**：Markdown 文本内容，可以一次性传入完整内容，也可以通过流式方式逐步添加内容。

### 特殊功能
- 代码高亮（支持多种编程语言）
- 数学公式（使用 KaTeX）
- 提示框（警告、提示、错误）
- GFM 扩展

[GitHub源码仓库地址](https://github.com/xhy12345/v3-markdown-stream)
如果觉得好用，欢迎给个Star ⭐️ 支持一下！

## 贡献

欢迎提交 Issues 和 Pull Requests 来帮助改进这个组件！

## 许可证

MIT