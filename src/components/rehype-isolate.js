/**
 * rehype 插件：清理 Markdown 中的原生 HTML，剔除危险标签与属性
 *
 * 背景：组件通过 `rehype-raw` 渲染 Markdown 中的原生 HTML，会被原样
 * 插入 DOM。渲染结果现在位于 Shadow DOM 中，<style> 已被物理隔离，
 * 因此放行 <style>；但 <script> / 内联事件 / javascript: 协议等仍会
 * 造成 XSS，需要剔除。
 *
 * 该插件在 `rehype-raw` 之后执行，保留安全的内联 `style` 属性与常规标签，
 * 尽量不影响正常渲染。
 */

/** 存在安全风险或会加载外部资源的标签，直接剔除 */
const DROPPED_TAGS = new Set([
  'script',
  'link',
  'base',
  'meta',
  'iframe',
  'frame',
  'frameset',
  'object',
  'embed',
  'applet',
]);

/** javascript: 等危险协议 */
const DANGEROUS_PROTOCOL = /^\s*(?:javascript|vbscript|data:text\/html)/i;

function isElement(node) {
  return node && node.type === 'element';
}

/**
 * 清理单个元素上的危险属性：
 * - 内联事件（onclick / onerror ...）
 * - javascript: / vbscript: 协议
 */
function sanitizeProperties(node) {
  const properties = node.properties;
  if (!properties) return;

  for (const key of Object.keys(properties)) {
    // 移除内联事件属性
    if (/^on/i.test(key)) {
      delete properties[key];
      continue;
    }
    // 移除危险协议
    const value = properties[key];
    if (typeof value === 'string' && DANGEROUS_PROTOCOL.test(value)) {
      delete properties[key];
    }
  }
}

/** 深度遍历 hast 树，剔除全局标签并清理属性 */
function walk(node) {
  if (!node || !Array.isArray(node.children)) return;

  node.children = node.children.filter((child) => {
    if (isElement(child) && DROPPED_TAGS.has(child.tagName)) {
      return false;
    }
    return true;
  });

  for (const child of node.children) {
    if (isElement(child)) {
      sanitizeProperties(child);
    }
    walk(child);
  }
}

export default function rehypeIsolate() {
  return (tree) => {
    walk(tree);
  };
}
