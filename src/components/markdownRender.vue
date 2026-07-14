<template>
  <div class="v3_markdown_stream_render_mo020">
    <VueMarkdownStreamRender :markstr="markString" :pluginRegistry="pluginRegistry || defaultRegistry" :onRefClick="handleRefClick" />
  </div>
</template>
<script setup>
import { defineProps, computed, defineEmits } from "vue";
import VueMarkdownStreamRender from "./markdown-parse.js";
import { LOADING_TAG } from './loading.js';
import { createPluginRegistry } from './plugin.js';

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

let props = defineProps({
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

let markString = computed(() => stripBrokenImages(props.markInfo));
</script>
<style lang="scss">
.v3_markdown_stream_render_mo020 {
  --link-color: #0c5ccb;
  font-size: v-bind(baseFontSize);
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: rgba(106, 101, 101, 0.5);
  }
  ref {
    font-weight: bold;
    cursor: pointer;
    margin: 0 0.3em;
    color: v-bind(themeColor);
  }
  strong {
    color: v-bind(themeColor);
  }
  .table_div {
    width: fit-content;
    max-width: 100%;
    position: relative;
    &:hover {
      img {
        opacity: 1;
      }
    }
  }
  .three-body {
  --uib-size: 35px;
  --uib-speed: 0.8s;
  --uib-color: v-bind(themeColor);
  position: relative;
  display: inline-block;
  height: var(--uib-size);
  width: var(--uib-size);
  animation: spin78236 calc(var(--uib-speed) * 2.5) infinite linear;
  }

  .three-body__dot {
  position: absolute;
  height: 100%;
  width: 30%;
  }

  .three-body__dot:after {
  content: '';
  position: absolute;
  height: 0%;
  width: 100%;
  padding-bottom: 100%;
  background-color: var(--uib-color);
  border-radius: 50%;
  }

  .three-body__dot:nth-child(1) {
  bottom: 5%;
  left: 0;
  transform: rotate(60deg);
  transform-origin: 50% 85%;
  }

  .three-body__dot:nth-child(1)::after {
  bottom: 0;
  left: 0;
  animation: wobble1 var(--uib-speed) infinite ease-in-out;
  animation-delay: calc(var(--uib-speed) * -0.3);
  }

  .three-body__dot:nth-child(2) {
  bottom: 5%;
  right: 0;
  transform: rotate(-60deg);
  transform-origin: 50% 85%;
  }

  .three-body__dot:nth-child(2)::after {
  bottom: 0;
  left: 0;
  animation: wobble1 var(--uib-speed) infinite
      calc(var(--uib-speed) * -0.15) ease-in-out;
  }

  .three-body__dot:nth-child(3) {
  bottom: -5%;
  left: 0;
  transform: translateX(116.666%);
  }

  .three-body__dot:nth-child(3)::after {
  top: 0;
  left: 0;
  animation: wobble2 var(--uib-speed) infinite ease-in-out;
  }

  @keyframes spin78236 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
  }

  @keyframes wobble1 {
  0%,
    100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(-66%) scale(0.65);
    opacity: 0.8;
  }
  }

  @keyframes wobble2 {
  0%,
    100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(66%) scale(0.65);
    opacity: 0.8;
  }
  }

  .pre_div {
    position: relative;
    &:hover {
      .copy_btn {
        opacity: 1;
      }
    }
    .copy_btn {
      cursor: pointer;
      color: #fff;
      z-index: 2;
      background-color: gray;
      padding: 2px 5px;
      border-radius: 2px;
      font-size: 12px;
      position: absolute;
      top: 10px;
      right: 10px;
      opacity: 0;
      transition: opacity 0.6s;
    }
  }
  .download_btn {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    img {
      width: 20px;
      opacity: 0;
      height: 20px;
      background-color: #fff;
      box-shadow: 0 0 10px rgb(185, 185, 185);
      overflow: hidden;
      display: inline-block;
      cursor: pointer;
      transition: opacity 0.6s;
    }
  }
  *:not(.v3md-plugin-container):not(.v3md-plugin-container *) {
    animation: fade-in 0.6s ease-in-out;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .v3md-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
  }
  .v3md-plugin-container {
    animation: none !important;
  }
  a {
    color: var(--link-color);
    text-decoration: none;
  }
  ul {
    list-style-type: disc;
  }
  .remark-container {
    margin: 10px 0;
    padding: 15px 10px;
    border-radius: 5px;
    &.warning {
      background-color: rgb(255 145 0 / 6%);
      border-left: 5px solid #ff9100;
    }
    &.tip {
      background-color: rgb(0 191 165 / 6%);
      border-left: 5px solid #00bfa5;
    }
    &.error {
      background-color: rgb(255 82 82 / 6%);
      border-left: 5px solid #ff5252;
    }
  }
  .katex-display {
    overflow-x: scroll;
    overflow-y: hidden;
  }
  img {
    max-width: 100%;
  }
  pre {
    position: relative;
    border-radius: 4px;
    overflow-x: auto;
  }
  table {
    margin: 10px 0;
    width: 100%;
    display: block;
    overflow-x: scroll;
    border-collapse: collapse;
  }
  td,
  th {
    border: 1px solid #000;
    padding: 5px 10px;
    min-width: 40px;
  }
  tbody tr:nth-child(odd) {
    background-color: #eee;
  }
  blockquote {
    display: block;
    font-weight: 500;
    font-style: italic;
    border-left: 5px solid #e2e8f0;
    quotes: "\201C""\201D""\2018""\2019";
    padding-left: 1em;
    margin: 10px;
  }
}
</style>