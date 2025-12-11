# v3-markdown-stream

[![NPM version](https://img.shields.io/npm/v/v3-markdown-stream.svg?style=flat)](https://npmjs.org/package/v3-markdown-stream) [![NPM downloads](http://img.shields.io/npm/dm/v3-markdown-stream.svg?style=flat)](https://npmjs.org/package/v3-markdown-stream)

一个基于 Vue 3 的高性能 Markdown 流式渲染组件，支持增量输出、无闪屏、无卡顿，样式友好。

[演示地址](https://xhy12345.github.io/ "演示地址")

> **🔧 环境要求：**
> - `@vitejs/plugin-vue` 版本必须 **≥ 6.0.1** 
> - `vite` 版本必须 **≥ 7.2.2**
> 
> 请确保你的项目依赖满足以上版本要求，否则可能会出现兼容性问题！

## 特性

- ✨ **流式输出**：支持增量渲染 Markdown 内容，适用于大文本或流式数据场景
- 🎯 **无闪屏渲染**：每次更新内容时保持平滑过渡，提升用户体验(不完整图片链接、表格、数学公式缓存处理)
- 🎨 **样式友好**：内置美观的默认样式，支持自定义主题颜色
- 🚀 **高性能**：使用 Vue 的 computed 缓存和响应式系统优化渲染性能
- 📋 **全面的 Markdown 支持**：代码高亮、GFM、原生Html标签、表格支持导出、代码支持可复制

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

|参数名|必填|类型|默认值|描述|
|-|-|-|-|-|
|markInfo|是|String|''|Markdown 文本内容，可以一次性传入完整内容，也可以通过流式方式逐步添加内容|
|themeColor|否|String|'#000000'|主题色（Strong标签字体颜色）|
|baseFontSize|否|String|'1em'|基础字体大小|



[GitHub源码仓库地址](https://github.com/xhy12345/v3-markdown-stream)
如果觉得好用，欢迎给个Star ⭐️ 支持一下！

## 贡献

欢迎提交 Issues 和 Pull Requests 来帮助改进这个组件！

## 许可证

MIT