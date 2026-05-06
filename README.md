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
- 🧩 **插件系统**：支持自定义组件渲染插件，可在 Markdown 中嵌入 ECharts 图表等自定义 Vue 组件
- ⏳ **碎片 Loading**：流式输出中不完整的图片、数学公式、插件语法自动展示 loading 动画

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
|pluginRegistry|否|Object|null|插件注册表，通过 `createPluginRegistry` 创建，用于支持自定义组件渲染|

## 事件

|事件名|参数|描述|
|-|-|-|
|refClick|numbers: number[]|当 `<ref>` 标签被点击时触发，参数为从 `[3]` 或 `[1,2,3]` 中提取的数字数组|

### 用法示例

```vue
<template>
  <MarkdownRender :markInfo="content" @refClick="onRefClick" />
</template>

<script setup>
const onRefClick = (numbers) => {
  console.log('点击了引用:', numbers) // 例如 [3] 或 [1, 2, 3]
}
</script>
```

Markdown 中使用：

```markdown
这是引用文献<ref>[3]</ref>
这是多个引用<ref>[1,2,3]</ref>
```

## 插件系统

插件系统允许你在 Markdown 中嵌入自定义 Vue 组件。**ECharts 图表插件已内置**，无需手动引入即可直接使用。

### 基本用法

ECharts 插件默认内置，直接在 Markdown 中使用 `[[echarts ...]]` 语法即可：

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

const markdownContent = ref('# 图表\n\n[[echarts {"type":"bar","data":[10,20,30]}]]')
</script>
```

### Markdown 语法

在 Markdown 中使用 `[[插件名 JSON配置]]` 的语法嵌入自定义组件：

```markdown
[[echarts {"type":"bar","data":[10,20,30,40,50]}]]

[[echarts {"type":"line","data":[120,200,150,80,70,110,130],"width":"100%","height":"250px"}]]

[[echarts {"series":[{"type":"pie","data":[{"value":1048,"name":"Chrome"},{"value":735,"name":"Firefox"}]}],"tooltip":{"trigger":"item"}}]]
```

### ECharts 插件

ECharts 插件支持以下配置：

|配置项|类型|默认值|描述|
|-|-|-|-|
|type|String|-|图表类型：bar、line、pie 等（简单模式）|
|data|Array|-|图表数据（简单模式，配合 type 使用）|
|width|String|'100%'|图表容器宽度|
|height|String|'300px'|图表容器高度|
|series|Array|-|ECharts series 配置（完整模式，与 type 互斥）|
|其他|Any|-|所有 ECharts option 配置项均可传入|

- **简单模式**：传入 `type` + `data`，自动补全坐标轴等配置
- **完整模式**：直接传入 ECharts 的 `option` 配置，支持所有 ECharts 功能

### 自定义插件

你可以创建自己的插件，只需定义一个符合接口的对象：

```js
import { createPluginPattern } from 'v3-markdown-stream'

const myPlugin = {
  name: 'mywidget',                          // 插件名（用于 [[mywidget ...]] 语法）
  tagName: 'v3md-mywidget',                  // 自定义 HTML 标签名
  pattern: createPluginPattern('mywidget'),  // 匹配正则（或自定义 RegExp）
  component: MyWidgetVueComponent,           // Vue 组件，接收 config prop
}

const registry = createPluginRegistry([myPlugin])
```

插件组件会通过 `config` prop 接收解析后的 JSON 配置对象：

```vue
<script setup>
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})
</script>
```

### API

#### `createPluginRegistry(plugins)`

创建插件注册表。

- **参数**：`plugins: Array<Plugin>` — 插件数组
- **返回**：插件注册表对象，传入 `MarkdownRender` 的 `pluginRegistry` prop

#### `createPluginPattern(name)`

根据插件名生成匹配 `[[name ...]]` 语法的正则表达式。

- **参数**：`name: String` — 插件名
- **返回**：`RegExp` — 全局正则表达式


[GitHub源码仓库地址](https://github.com/xhy12345/v3-markdown-stream)


如果觉得好用，欢迎给个Star ⭐️ 支持一下！

## 贡献

欢迎提交 Issues 和 Pull Requests 来帮助改进这个组件！

## 许可证

MIT