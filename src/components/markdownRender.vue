<template>
  <div class="v3_markdown_stream_render_mo020">
    <VueMarkdownStreamRender :markstr="markString" />
  </div>
</template>
<script setup>
import { defineProps, computed } from "vue";
import VueMarkdownStreamRender from "./markdown-parse.js";

/**
 * 处理图片流式碎片
 * @param {string} markdown - 原始 Markdown 字符串
 * @returns {string} 清理后的 Markdown 字符串
 */
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
      // 如果捕获到开启引号却没闭合，或者 src 后直接换行（缺引号），都认为不完整
      if (quote && !s.endsWith(quote)) return ""; // 引号没闭合
      if (!quote && /["']$/.test(src)) return ""; // src 结尾多余引号，也视为异常
      return s; // 完整定义，保留
    }
  );
  md = md.replace(
    /!\[([^\]]*)\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/g,
    (s, alt, body) => {
      const open = (body.match(/\(/g) || []).length;
      const close = (body.match(/\)/g) || []).length;
      if (open !== close) return ""; // 括号不匹配 → 不完整
      if (body.includes('"') && (body.match(/"/g) || []).length % 2) return "";
      if (body.includes("'") && (body.match(/'/g) || []).length % 2) return "";
      return s; // 完整，保留
    }
  );
  md = md.replace(/!\[[^\]]*\]\([^)]*$/g, "");
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

/**
 * 清除 Markdown 中未闭合的块级公式（$$ 开头未闭合）
 * @param {string} markdown - 原始 Markdown 字符串
 * @returns {string} 处理后的 Markdown 字符串
 */
function clearUnclosedBlockMath(markdown) {
  // 正则说明：
  // 1. /\$\$(?!.*?\$\$).*$/s - 核心正则
  // 2. \$\$ - 匹配块级公式开始标记
  // 3. (?!.*?\$\$) - 正向否定预查：确保后面没有 $$ 闭合（非贪婪匹配任意字符）
  // 4. .*$ - 匹配从 $$ 开始到字符串结束的所有内容
  // 5. s 修饰符 - 让 . 匹配换行符（支持多行公式）
  // 6. g 修饰符 - 全局匹配（处理多个未闭合公式的极端情况）
  return markdown.replace(/\$\$(?!.*?\$\$).*$/gs, '');
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
  strong {
    color: v-bind(themeColor);
  }
  .table_div {
    width: fit-content;
    position: relative;
    &:hover {
      img {
        opacity: 1;
      }
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
  * {
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