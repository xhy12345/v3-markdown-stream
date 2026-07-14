import { h, defineComponent, ref, watch, onMounted, shallowRef } from 'vue';

const MermaidComponent = defineComponent({
  name: 'V3mdMermaid',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const mermaidModule = shallowRef(null);
    const svgContent = ref('');
    const renderError = ref(false);
    const rendering = ref(false);

    let lastCode = '';

    const escapeHtml = (str) => {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const renderDiagram = async (code) => {
      if (!code || !mermaidModule.value) return;

      const trimmedCode = code.trim();
      if (!trimmedCode) return;
      if (trimmedCode === lastCode && !renderError.value) return;

      lastCode = trimmedCode;
      renderError.value = false;
      rendering.value = true;

      try {
        const { default: mermaid } = mermaidModule.value;
        const id = `mermaid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const { svg } = await mermaid.render(id, trimmedCode);
        svgContent.value = svg;
      } catch (e) {
        renderError.value = true;
        svgContent.value = `<pre style="color:#999;font-size:13px;white-space:pre-wrap;">${escapeHtml(trimmedCode)}</pre>`;
      } finally {
        rendering.value = false;
      }
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
        if (props.config.code) {
          await renderDiagram(props.config.code);
        }
      } catch (e) {
        renderError.value = true;
      }
    });

    watch(
      () => props.config,
      (newConfig) => {
        if (newConfig && newConfig.code) {
          renderDiagram(newConfig.code);
        }
      }
    );

    const handleDownload = () => {
      if (!svgContent.value) return;
      const blob = new Blob([svgContent.value], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mermaid.svg';
      a.click();
      URL.revokeObjectURL(url);
    };

    return () => {
      return h('div', {
        class: 'v3md-mermaid-container',
        style: {
          backgroundColor: '#eee',
          borderRadius: '10px',
          width: props.config.width || '100%',
          textAlign: 'center',
          overflow: 'auto',
          position: 'relative',
        },
      }, [
        svgContent.value && !rendering.value
          ? h('div', {
              class: 'download_btn',
              onClick: handleDownload,
              title: '下载 SVG',
              innerHTML: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
            })
          : null,
        h('div', {
          innerHTML: rendering.value ? '' : svgContent.value,
        }),
      ]);
    };
  },
});

export const mermaidPlugin = {
  name: 'mermaid',
  tagName: 'v3md-mermaid',
  pattern: /\[\[mermaid\s+([\s\S]*?)\]\]/g,
  component: MermaidComponent,
};
