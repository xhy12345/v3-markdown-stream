import { h, defineComponent, ref, watch, shallowRef } from 'vue';
import { V3mdLoading, LOADING_TAG } from './loading.js';
import { echartsPlugin } from './echarts-plugin.js';

const DEFAULT_PLUGINS = [echartsPlugin];

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

    for (const [, plugin] of pluginMap) {
      const incompleteRegex = new RegExp(
        `\\[\\[${escapeRegex(plugin.name)}\\b[\\s\\S]*$`,
        'g'
      );
      result = result.replace(incompleteRegex, () => {
        return `\n\n<div class="v3md-plugin-container"><${LOADING_TAG}></${LOADING_TAG}></div>\n\n`;
      });
    }

    return result;
  }

  function getComponentMappings() {
    if (cachedMappings) return cachedMappings;
    cachedMappings = {};
    for (const [, plugin] of pluginMap) {
      cachedMappings[plugin.tagName] = createPluginWrapper(plugin);
    }
    cachedMappings[LOADING_TAG] = V3mdLoading;
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
