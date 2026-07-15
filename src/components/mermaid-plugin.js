import { h, defineComponent, ref, watch, onMounted, shallowRef } from 'vue';
import { V3mdLoading } from './loading.js';

/**
 * Mermaid 纯渲染器组件
 * 只负责将 Mermaid 代码渲染为 SVG，不包含任何 UI 包装（工具栏、按钮等由 CodeBlockCard 管理）
 * 流式场景下语法不合法时显示 loading，合法后正常渲染
 */
export const MermaidRenderer = defineComponent({
  name: 'V3mdMermaidRenderer',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const mermaidModule = shallowRef(null);
    const svgContent = ref('');
    const isLoading = ref(true);
    let lastCode = '';
    let renderTimer = null;

    const renderDiagram = async (code) => {
      if (!code || !mermaidModule.value) return;
      const trimmedCode = code.trim();
      if (!trimmedCode) return;
      if (trimmedCode === lastCode && svgContent.value) return;

      lastCode = trimmedCode;

      try {
        const { default: mermaid } = mermaidModule.value;
        const id = `mermaid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const { svg } = await mermaid.render(id, trimmedCode);
        svgContent.value = svg;
        isLoading.value = false;
      } catch (e) {
        // 流式场景：语法不合法时不显示错误，保持 loading 状态
        // 保留已有 SVG（如果有）避免闪烁
        if (!svgContent.value) {
          isLoading.value = true;
        }
      }
    };

    /** 防抖渲染，避免流式高频触发 */
    const debouncedRender = (code) => {
      if (renderTimer) clearTimeout(renderTimer);
      renderTimer = setTimeout(() => {
        renderDiagram(code);
      }, 150);
    };

    onMounted(async () => {
      try {
        mermaidModule.value = await import('mermaid');
        const { default: mermaid } = mermaidModule.value;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });
        if (props.code) {
          await renderDiagram(props.code);
        }
      } catch (e) {
        // mermaid 模块加载失败
        isLoading.value = false;
      }
    });

    watch(() => props.code, (newCode) => {
      if (newCode) debouncedRender(newCode);
    });

    return () => {
      if (isLoading.value && !svgContent.value) {
        return h(V3mdLoading);
      }
      return h('div', {
        class: 'v3md-mermaid-renderer',
        style: { width: '100%', textAlign: 'center' },
        innerHTML: svgContent.value,
      });
    };
  },
});

/**
 * 兼容 [[mermaid ...]] 插件语法的包装组件
 * 将 config.code 转发给 MermaidRenderer
 */
const MermaidLegacyWrapper = defineComponent({
  name: 'V3mdMermaidLegacy',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => h(MermaidRenderer, { code: props.config.code || '' });
  },
});

export const mermaidPlugin = {
  name: 'mermaid',
  tagName: 'v3md-mermaid',
  pattern: /\[\[mermaid\s+([\s\S]*?)\]\]/g,
  component: MermaidLegacyWrapper,
};
