<template>
  <div
    ref="hostRef"
    class="v3md-shadow-host"
    v-bind="$attrs"
    :style="hostVars"
  ></div>
  <Teleport v-if="shadowContainer" :to="shadowContainer">
    <VueMarkdownStreamRender
      :markstr="markString"
      :pluginRegistry="pluginRegistry || defaultRegistry"
      :onRefClick="handleRefClick"
    />
  </Teleport>
</template>

<script setup>
import { defineProps, defineOptions, computed, defineEmits, ref, shallowRef, onMounted } from "vue";
import VueMarkdownStreamRender from "./markdown-parse.js";
import { LOADING_TAG } from './loading.js';
import { createPluginRegistry } from './plugin.js';
import { SHADOW_CSS } from './shadow-styles.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  markInfo: {
    type: String,
    require: true,
    default: "",
  },
  themeColor: {
    type: String,
    default: "#000000",
  },
  baseFontSize: {
    type: String,
    default: "1em",
  },
  pluginRegistry: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['refClick']);

const handleRefClick = (numbers) => {
  emit('refClick', numbers);
};

const defaultRegistry = createPluginRegistry();

const LOADING_PLACEHOLDER = `<${LOADING_TAG}></${LOADING_TAG}>`;

function stripBrokenImages(md) {
  if(typeof(md) !== 'string') {
    console.log('%c v3-markdown-stream：请传正确的md字符串～ ','background:#ea2039;color:#ffffff;padding:2px 5px;')
    return '';
  }
  if(!md) {
    return '';
  }
  md = md.replace(
    /^\s*\[([^\]]+)\]:[ \t]*(\S+)(?:[ \t]+(["'])(?:(?!\3)[\s\S])*?)?$/gm,
    (s, id, src, quote) => {
      if (quote && !s.endsWith(quote)) return LOADING_PLACEHOLDER;
      if (!quote && /["']$/.test(src)) return LOADING_PLACEHOLDER;
      return s;
    }
  );
  md = md.replace(
    /!\[([^\]]*)\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/g,
    (s, alt, body) => {
      const open = (body.match(/\(/g) || []).length;
      const close = (body.match(/\)/g) || []).length;
      if (open !== close) return LOADING_PLACEHOLDER;
      if (body.includes('"') && (body.match(/"/g) || []).length % 2) return LOADING_PLACEHOLDER;
      if (body.includes("'") && (body.match(/'/g) || []).length % 2) return LOADING_PLACEHOLDER;
      return s;
    }
  );
  md = md.replace(/!\[[^\]]*\]\([^)]*$/g, LOADING_PLACEHOLDER);
  return clearUnclosedBlockMath(filterInvalidTables(md));
}

/**
 * 过滤流式输出中结构不完整的表格字符串
 * @param {string} content - 流式输出的原始内容
 * @returns {string} 过滤后的内容（仅保留合法表格，非法表格替换为空）
 */
function filterInvalidTables(content) {
  // 表头加载完成后过滤
  // const tableRegex = /(?:^\|(?:\s*.+?\s*)?\|?$[\n\r]?)+(?:^\|(?:\s*[-:]+)+(?:\s*\|\s*[-:]+)*\s*\|?$[\n\r]?)+(?:^\|(?:\s*.+?\s*)?\|?$[\n\r]?)*(?=\n|$)/gm;
  //宽松模式过滤
  const tableRegex = /^\|(?:\s*.+?\s*)?\|?$(?:\r?\n^\|(?:\s*[-:]+)+(?:\s*\|\s*[-:]+)*\s*\|?$(?:\r?\n^\|(?:\s*.+?\s*)?\|?$)*)?/gm;
  return content.replace(tableRegex, (match) => {
    // 分割表头行和分隔符行
    const lines = match.trim().split(/[\r\n]+/).filter(line => line.trim());
    if (lines.length < 2) return ''; // 至少需要表头行 + 分隔符行
    // 最后一行表头（处理多行表头场景）
    const headerLine = lines[0].trim();
    // 分隔符行
    const separatorLine = lines[1].trim();

    // 提取表头列数：分割 | 后，过滤空字符串（处理前后 | 的情况）
    const headerColumns = headerLine.split('|').map(col => col.trim()).filter(col => col);
    const headerCount = headerColumns.length;

    // 提取分隔符列数：分割 | 后，过滤空字符串，且必须包含至少1个 -
    const separatorColumns = separatorLine.split('|')
      .map(col => col.trim())
      .filter(col => col && /-/.test(col)); // 分隔符必须包含 -
    const separatorCount = separatorColumns.length;

    // 仅当列数完全一致时保留表格，否则替换为空
    return (headerCount === separatorCount && headerCount>0 && separatorCount>0) ? match : '';
  });
}

function clearUnclosedBlockMath(markdown) {
  const doubleDollarMatches = markdown.match(/\$\$/g);
  const doubleDollarCount = doubleDollarMatches
  ? doubleDollarMatches.length
  : 0;

  if (doubleDollarCount % 2 !== 0) {
  const lastIndex = markdown.lastIndexOf("$$");
  return markdown.substring(0, lastIndex) + LOADING_PLACEHOLDER;
  }

  return markdown;
}

let markString = computed(() => stripBrokenImages(props.markInfo));

// ============ Shadow DOM 隔离 ============
// 宿主元素（light DOM），承载主题相关的 CSS 变量
const hostRef = ref(null);
// 渲染内容的挂载点（shadow root 内部），用 shallowRef 避免 Vue 对 DOM 元素做响应式代理
const shadowContainer = shallowRef(null);

// 通过 CSS 变量把主题色 / 字号传递进 shadow tree（自定义属性可穿透 shadow 边界继承）
const hostVars = computed(() => ({
  '--v3md-theme-color': props.themeColor,
  '--v3md-base-font-size': props.baseFontSize,
}));

onMounted(() => {
  const host = hostRef.value;
  if (!host) return;

  // 复用已存在的 shadow root，避免 HMR / 重复挂载时报错
  const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });

  // 重置 shadow 内容（幂等）
  shadow.innerHTML = '';

  const styleEl = document.createElement('style');
  styleEl.textContent = SHADOW_CSS;

  // 渲染内容的容器，样式表中的 .v3_markdown_stream_render_mo020 即以此为根
  const container = document.createElement('div');
  container.className = 'v3_markdown_stream_render_mo020';

  shadow.appendChild(styleEl);
  shadow.appendChild(container);

  shadowContainer.value = container;
});
</script>

<style scoped>
.v3md-shadow-host {
  display: block;
}
</style>
