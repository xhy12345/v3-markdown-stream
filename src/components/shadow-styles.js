/**
 * Shadow Root 内部样式汇总
 *
 * 组件渲染在 Shadow DOM 中，外部注入的 <style> 无法穿透 shadow 边界，
 * 因此这里把渲染所需的全部样式（组件自身样式 + KaTeX 公式 + 代码高亮）
 * 以字符串形式收集起来，由 markdownRender.vue 在创建 shadow root 时注入。
 *
 * 说明：KaTeX 的字形在打包时已被内联为 data URI，样式表完全自包含，
 * 注入到 shadow root 后不会出现相对路径资源解析失败的问题。
 */
import markdownCss from './markdown-style.scss?inline';
import katexCss from 'katex/dist/katex.min.css?inline';
import highlightCss from 'highlight.js/styles/github-dark.css?inline';

export const SHADOW_CSS = [markdownCss, katexCss, highlightCss].join('\n');
