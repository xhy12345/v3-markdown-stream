import { h, defineComponent, ref, watch, shallowRef } from 'vue';
import { V3mdLoading, LOADING_TAG } from './loading.js';
import { echartsPlugin } from './echarts-plugin.js';
import { mermaidPlugin } from './mermaid-plugin.js';
import { CODE_BLOCK_CARD_TAG, CodeBlockCard } from './code-block-card.js';
import { ReportLinkCard, REPORT_LINK_TAG } from './report-link-card.js';

const DEFAULT_PLUGINS = [echartsPlugin, mermaidPlugin];

export function createPluginPattern(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\[\\[${escaped}\\s+([\\s\\S]*?)\\]\\]`, 'g');
}

export function createPluginRegistry(plugins = []) {
  const allPlugins = [...DEFAULT_PLUGINS, ...plugins];
  const pluginMap = new Map();

  for (const plugin of allPlugins) {
    pluginMap.set(plugin.name, plugin);
  }

  let cachedMappings = null;

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function ensureGlobalFlag(regex) {
    if (regex.global) return regex;
    return new RegExp(regex.source, regex.flags + 'g');
  }

  function transformMarkdown(markdown) {
    if (pluginMap.size === 0) return markdown;

    let result = markdown;

    // 转换 ```mermaid 和 ```echarts 代码块为 v3md-code-block-card 标签
    const codeBlockTypes = ['mermaid', 'echarts'];
    for (const blockType of codeBlockTypes) {
      if (pluginMap.has(blockType)) {
        // 完整的代码块
        result = result.replace(
          new RegExp('```' + blockType + '\\s*\\n([\\s\\S]*?)```', 'g'),
          (match, code) => {
            const encodedType = encodeURIComponent(blockType);
            const encodedCode = encodeURIComponent(code.trimEnd());
            return `\n\n<div class="v3md-plugin-container"><${CODE_BLOCK_CARD_TAG} data-type="${encodedType}" data-code="${encodedCode}"></${CODE_BLOCK_CARD_TAG}></div>\n\n`;
          }
        );

        // 未闭合的代码块（流式场景）
        result = result.replace(
          new RegExp('```' + blockType + '\\s*\\n([\\s\\S]*?)$', 'g'),
          (match, code) => {
            // Mermaid 在流式场景下不渲染，等代码块闭合后再渲染
            if (blockType === 'mermaid') {
              return `\n\n<div class="v3md-plugin-container"><${LOADING_TAG}></${LOADING_TAG}></div>\n\n`;
            }
            // ECharts 等其他类型：传部分代码，由 JSON.parse 校验决定渲染还是 loading
            if (code.trim()) {
              const encodedType = encodeURIComponent(blockType);
              const encodedCode = encodeURIComponent(code.trimEnd());
              return `\n\n<div class="v3md-plugin-container"><${CODE_BLOCK_CARD_TAG} data-type="${encodedType}" data-code="${encodedCode}"></${CODE_BLOCK_CARD_TAG}></div>\n\n`;
            }
            return `\n\n<div class="v3md-plugin-container"><${LOADING_TAG}></${LOADING_TAG}></div>\n\n`;
          }
        );
      }
    }

    // 处理 [[plugin ...]] 插件语法
    for (const [, plugin] of pluginMap) {
      const pattern = ensureGlobalFlag(plugin.pattern);
      let index = 0;
      result = result.replace(pattern, (match, ...args) => {
        const configStr = typeof args[0] === 'string' ? args[0] : '{}';
        const encodedConfig = encodeURIComponent(configStr);
        const key = `v3md_${plugin.name}_${index}`;
        index++;
        return `\n\n<div class="v3md-plugin-container"><${plugin.tagName} data-config="${encodedConfig}" data-key="${key}"></${plugin.tagName}></div>\n\n`;
      });
    }

    // 处理未闭合的 [[plugin ...]] 语法（流式场景）
    for (const [, plugin] of pluginMap) {
      const incompleteRegex = new RegExp(
        `\\[\\[${escapeRegex(plugin.name)}\\b[\\s\\S]*$`,
        'g'
      );
      result = result.replace(incompleteRegex, () => {
        return `\n\n<div class="v3md-plugin-container"><${LOADING_TAG}></${LOADING_TAG}></div>\n\n`;
      });
    }

    // 转换包含 type=result 参数的 Markdown 链接为报告链接卡片
    result = result.replace(
      /\[([^\]]+)\]\(([^)]*\?[^)]*type=result[^)]*)\)/g,
      (match, text, url) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        return `<div class="v3md-plugin-container"><${REPORT_LINK_TAG} data-url="${encodedUrl}" data-text="${encodedText}"></${REPORT_LINK_TAG}></div>`;
      }
    );

    return result;
  }

  function getComponentMappings() {
    if (cachedMappings) return cachedMappings;
    cachedMappings = {};
    for (const [, plugin] of pluginMap) {
      cachedMappings[plugin.tagName] = createPluginWrapper(plugin);
    }
    // 注册 CodeBlockCard 组件映射
    cachedMappings[CODE_BLOCK_CARD_TAG] = defineComponent({
      name: 'V3mdCodeBlockCardWrapper',
      props: {
        node: {
          type: Object,
          required: true,
        },
      },
      setup(props) {
        return () => h(CodeBlockCard, { node: props.node });
      },
    });
    cachedMappings[LOADING_TAG] = V3mdLoading;
    // 注册 ReportLinkCard 组件映射
    cachedMappings[REPORT_LINK_TAG] = defineComponent({
      name: 'V3mdReportLinkCardWrapper',
      props: {
        node: {
          type: Object,
          required: true,
        },
      },
      setup(props) {
        return () => h(ReportLinkCard, { node: props.node });
      },
    });
    return cachedMappings;
  }

  return {
    register(plugin) {
      pluginMap.set(plugin.name, plugin);
      cachedMappings = null;
    },
    transformMarkdown,
    getComponentMappings,
  };
}

function createPluginWrapper(plugin) {
  return defineComponent({
    name: `V3mdPlugin_${plugin.name}`,
    props: {
      node: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const configRef = shallowRef({});
      let lastRawConfig = '';

      watch(
        () => props.node,
        (node) => {
          const rawConfig =
            node.properties?.dataConfig ||
            node.properties?.['data-config'] ||
            '';
          if (rawConfig === lastRawConfig) return;
          lastRawConfig = rawConfig;
          try {
            configRef.value = JSON.parse(decodeURIComponent(rawConfig));
          } catch (e) {
            console.error(
              `[v3-markdown-stream] Plugin "${plugin.name}" config parse error:`,
              e
            );
            configRef.value = {};
          }
        },
        { immediate: true }
      );

      return () => {
        const key =
          props.node.properties?.dataKey ||
          props.node.properties?.['data-key'] ||
          '';
        return h(plugin.component, { config: configRef.value, key });
      };
    },
  });
}
