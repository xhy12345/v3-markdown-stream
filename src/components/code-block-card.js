import { h, defineComponent, ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { MermaidRenderer } from './mermaid-plugin.js';
import { EChartsRenderer } from './echarts-plugin.js';
import { V3mdLoading } from './loading.js';

export const CODE_BLOCK_CARD_TAG = 'v3md-code-block-card';

// ============ SVG 图标 ============
const SVG_ICONS = {
  eye: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  code: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronUp: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
  copy: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  download: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  fullscreen: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  zoomIn: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  zoomOut: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  mermaidIcon: '<svg t="1784083588433" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4589" width="16" height="16"><path d="M940.202667 125.525333l41.813333 1.792 1.792 41.813334a480.128 480.128 0 0 1-208.896 416.512 187.861333 187.861333 0 0 0-81.322667 155.136v179.2h-363.093333v-179.2a187.733333 187.733333 0 0 0-81.493333-155.093334v-0.042666A480.384 480.384 0 0 1 40.234667 169.173333l1.706666-41.813333 41.813334-1.834667A480.341333 480.341333 0 0 1 512 352.682667a480.554667 480.554667 0 0 1 408.746667-227.541334l19.498666 0.426667z m-48.213334 91.733334a389.12 389.12 0 0 0-337.152 254.933333L512 590.549333l-42.837333-118.357333a389.205333 389.205333 0 0 0-337.237334-254.933333 389.290667 389.290667 0 0 0 168.618667 293.248l0.128 0.085333a278.826667 278.826667 0 0 1 120.874667 230.314667v87.978666h180.906666v-87.978666a278.826667 278.826667 0 0 1 120.874667-230.314667l0.128-0.085333a389.077333 389.077333 0 0 0 168.533333-293.248z" p-id="4590" fill="#7c3aed"></path></svg>',
  echartsIcon: '<svg t="1784084056446" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5812" width="16" height="16"><path d="M689.4 98.2l236.5 236.5V98.2H689.4zM393.8 512v413.9h236.5V571.1L512 630.2 393.8 512z m295.6 413.8h236.5v-532L689.4 571.1v354.7z m-591.2 0h236.5V512L98.2 689.4v236.4z" p-id="5813" fill="#2563eb"></path><path d="M843.5 190.4c-8.2-11.6-24.4-14.4-36.1-6.2L530.7 379.9 353.6 209.3 107.9 404.4c-11.2 8.9-13 25.2-4.2 36.3 5.1 6.4 12.6 9.8 20.3 9.8 5.6 0 11.3-1.8 16.1-5.6l210.2-167 175.3 168.9 311.7-220.4c11.7-8.2 14.5-24.4 6.2-36z" p-id="5814" fill="#2563eb"></path></svg>',
};

// ============ 全屏遮罩组件 ============
const FullscreenOverlay = defineComponent({
  name: 'V3mdFullscreenOverlay',
  props: {
    onClose: { type: Function, required: true },
  },
  setup(props, { slots }) {
    const handleKeydown = (e) => {
      if (e.key === 'Escape') props.onClose();
    };
    onMounted(() => document.addEventListener('keydown', handleKeydown));
    onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
    return () =>
      h(
        'div',
        {
          class: 'v3md-fullscreen-overlay',
          onClick: (e) => {
            if (e.target === e.currentTarget) props.onClose();
          },
        },
        slots.default ? slots.default() : null
      );
  },
});

// ============ CodeBlockCard 主组件 ============
export const CodeBlockCard = defineComponent({
  name: 'V3mdCodeBlockCard',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // ---- 从 node 属性提取数据 ----
    const type = ref('');
    const rawCode = ref('');

    const extractProps = () => {
      const nodeType =
        props.node.properties?.dataType || props.node.properties?.['data-type'] || '';
      const nodeCode =
        props.node.properties?.dataCode ||
        props.node.properties?.['data-code'] ||
        '';
      try {
        type.value = decodeURIComponent(nodeType);
        rawCode.value = decodeURIComponent(nodeCode);
      } catch (e) {
        type.value = nodeType;
        rawCode.value = nodeCode;
      }
    };

    extractProps();
    watch(() => props.node, extractProps, { immediate: true });

    // ---- 内部状态 ----
    const mode = ref('preview'); // 'preview' | 'source'
    const collapsed = ref(false);
    const zoom = ref(100);
    const fullscreen = ref(false);
    const copySuccess = ref(false);

    // 拖拽缩放状态
    const panX = ref(0);
    const panY = ref(0);
    const isDragging = ref(false);
    const dragStartPos = ref({ x: 0, y: 0 });
    const dragStartPan = ref({ x: 0, y: 0 });
    const previewRef = ref(null);

    // 触摸相关状态
    const touchState = ref({
      active: false,
      touches: 0,
      startDist: 0,
      startCenter: { x: 0, y: 0 },
      startPan: { x: 0, y: 0 },
      startZoom: 100,
      lastTouch: { x: 0, y: 0 },
    });

    // ---- 计算属性 ----
    const isMermaid = computed(() => type.value === 'mermaid');
    const isEcharts = computed(() => type.value === 'echarts');
    const typeLabel = computed(() =>
      isMermaid.value ? 'Mermaid' : isEcharts.value ? 'ECharts' : ''
    );
    const typeColor = computed(() =>
      isMermaid.value ? '#7c3aed' : isEcharts.value ? '#2563eb' : '#666'
    );
    const typeIcon = computed(() =>
      isMermaid.value
        ? SVG_ICONS.mermaidIcon
        : isEcharts.value
          ? SVG_ICONS.echartsIcon
          : ''
    );

    const langClass = computed(() =>
      isMermaid.value ? 'language-mermaid' : 'language-json'
    );

    const zoomMin = computed(() => (fullscreen.value ? 25 : 50));
    const zoomMax = computed(() => (fullscreen.value ? 300 : 200));
    const canZoomIn = computed(() => zoom.value < zoomMax.value);
    const canZoomOut = computed(() => zoom.value > zoomMin.value);

    // ---- 操作方法 ----

    /** 复制原始代码 */
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(rawCode.value);
      } catch {
        // fallback for non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = rawCode.value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    };

    /** 下载 */
    const handleDownload = async () => {
      if (mode.value === 'source') {
        // Source 模式：下载代码文件
        const ext = isMermaid.value ? '.mermaid' : '.json';
        const blob = new Blob([rawCode.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagram${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      // Preview 模式：下载图表
      await nextTick();

      const container = previewRef.value;

      if (isMermaid.value && container) {
        const svgEl = container.querySelector('svg');
        if (svgEl) {
          const svgData = new XMLSerializer().serializeToString(svgEl);
          const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'mermaid-diagram.svg';
          a.click();
          URL.revokeObjectURL(url);
        }
      }

      if (isEcharts.value && container) {
        const canvasEl = container.querySelector('canvas');
        if (canvasEl) {
          const url = canvasEl.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = 'echarts-chart.png';
          a.click();
        }
      }
    };

    /** 缩放 */
    const handleZoomIn = () => {
      if (!canZoomIn.value) return;
      const oldZoom = zoom.value;
      const newZoom = zoom.value + 25;
      const scale = newZoom / oldZoom;
      panX.value = panX.value * scale;
      panY.value = panY.value * scale;
      zoom.value = newZoom;
    };
    const handleZoomOut = () => {
      if (!canZoomOut.value) return;
      const oldZoom = zoom.value;
      const newZoom = zoom.value - 25;
      const scale = newZoom / oldZoom;
      panX.value = panX.value * scale;
      panY.value = panY.value * scale;
      zoom.value = newZoom;
    };

    /** 全屏切换 */
    const toggleFullscreen = () => {
      fullscreen.value = !fullscreen.value;
    };

    // ---- 拖拽事件处理 ----

    /** 开始拖拽 */
    const handleDragStart = (e) => {
      if (mode.value !== 'preview') return;
      e.preventDefault();
      isDragging.value = true;
      dragStartPos.value = { x: e.clientX, y: e.clientY };
      dragStartPan.value = { x: panX.value, y: panY.value };
    };

    /** 拖拽移动 */
    const handleDragMove = (e) => {
      if (!isDragging.value) return;
      const dx = e.clientX - dragStartPos.value.x;
      const dy = e.clientY - dragStartPos.value.y;
      panX.value = dragStartPan.value.x + dx;
      panY.value = dragStartPan.value.y + dy;
    };

    /** 结束拖拽 */
    const handleDragEnd = () => {
      isDragging.value = false;
    };

    // ---- 滚轮缩放（以鼠标位置为中心）----

    const handleWheel = (e) => {
      if (mode.value !== 'preview') return;
      e.preventDefault();

      const container = previewRef.value?.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? -25 : 25;
      const oldZoom = zoom.value;
      const newZoom = Math.max(zoomMin.value, Math.min(zoomMax.value, oldZoom + delta));

      if (newZoom === oldZoom) return;

      const scale = newZoom / oldZoom;
      panX.value = mx - (mx - panX.value) * scale;
      panY.value = my - (my - panY.value) * scale;

      zoom.value = newZoom;
    };

    // ---- 触摸事件处理 ----

    /** 触摸开始 */
    const handleTouchStart = (e) => {
      if (mode.value !== 'preview') return;
      const touches = e.touches.length;
      touchState.value.touches = touches;
      touchState.value.active = true;

      if (touches === 1) {
        touchState.value.lastTouch = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        dragStartPan.value = { x: panX.value, y: panY.value };
      } else if (touches === 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dx = t1.clientX - t0.clientX;
        const dy = t1.clientY - t0.clientY;
        touchState.value.startDist = Math.sqrt(dx * dx + dy * dy);
        touchState.value.startCenter = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2,
        };
        touchState.value.startPan = { x: panX.value, y: panY.value };
        touchState.value.startZoom = zoom.value;
      }
    };

    /** 触摸移动 */
    const handleTouchMove = (e) => {
      if (!touchState.value.active || mode.value !== 'preview') return;
      e.preventDefault();

      if (e.touches.length === 1 && touchState.value.touches === 1) {
        const tx = e.touches[0].clientX;
        const ty = e.touches[0].clientY;
        panX.value = dragStartPan.value.x + (tx - touchState.value.lastTouch.x);
        panY.value = dragStartPan.value.y + (ty - touchState.value.lastTouch.y);
      } else if (e.touches.length === 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dx = t1.clientX - t0.clientX;
        const dy = t1.clientY - t0.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const scale = dist / touchState.value.startDist;
        const newZoom = Math.max(zoomMin.value, Math.min(zoomMax.value, touchState.value.startZoom * scale));

        const cx = (t0.clientX + t1.clientX) / 2;
        const cy = (t0.clientY + t1.clientY) / 2;
        const zScale = newZoom / touchState.value.startZoom;

        panX.value = cx - (cx - touchState.value.startPan.x) * zScale;
        panY.value = cy - (cy - touchState.value.startPan.y) * zScale;
        zoom.value = newZoom;
      }
    };

    /** 触摸结束 */
    const handleTouchEnd = () => {
      touchState.value.active = false;
    };

    /** 重置视图到初始状态 */
    const resetView = () => {
      zoom.value = 100;
      panX.value = 0;
      panY.value = 0;
    };

    // ---- 全局事件注册（拖拽需要 document 级别监听）----
    onMounted(() => {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    });

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    });

    // ---- UI 构建方法 ----

    /** 创建工具栏按钮 */
    const makeBtn = (iconSvg, title, onClick, active = false) =>
      h(
        'button',
        {
          class: ['card-toolbar-btn', { active }],
          title,
          type: 'button',
          onClick,
          innerHTML:
            iconSvg +
            (active && copySuccess.value
              ? ' <span style="margin-left:2px;font-size:11px;">已复制</span>'
              : ''),
        }
      );

    /** 工具栏左侧 - 类型标签 */
    const toolbarLeft = () => [
      h('span', { class: 'card-type-label', style: { color: "#666", fontSize: '13px', fontStyle: 'italic' } }, [
        h('span', { innerHTML: typeIcon.value, class: 'card-type-icon' }),
        h('span', { style: { fontWeight: '600', fontSize: '13px' } }, typeLabel.value),
      ]),
    ];

    /** 工具栏中间 - Preview/Source 切换 */
    const toolbarTabs = () => [
      h('div', {
        class: ['card-tab-btn', { active: mode.value === 'preview' }],
        onClick: () => { mode.value = 'preview'; },
        title: '预览',
      }, [h('span', { innerHTML: SVG_ICONS.eye }), h('span', { class: 'card-tab-text' }, 'Preview')]),
      h('div', {
        class: ['card-tab-btn', { active: mode.value === 'source' }],
        onClick: () => { mode.value = 'source'; },
        title: '源码',
      }, [h('span', { innerHTML: SVG_ICONS.code }), h('span', { class: 'card-tab-text' }, 'Source')]),
    ];

    /** 工具栏右侧 - 操作按钮 */
    const toolbarRight = () => [
      makeBtn(collapsed.value ? SVG_ICONS.chevronUp : SVG_ICONS.chevronDown, collapsed.value ? '展开' : '折叠', () => { collapsed.value = !collapsed.value; }),
      makeBtn(copySuccess.value ? '&#10003;' : SVG_ICONS.copy, copySuccess.value ? '已复制' : '复制', handleCopy, copySuccess.value),
      makeBtn(SVG_ICONS.download, '下载', handleDownload),
      fullscreen.value
        ? makeBtn(SVG_ICONS.close, '关闭全屏', toggleFullscreen)
        : makeBtn(SVG_ICONS.fullscreen, '全屏', toggleFullscreen),
    ];

    /** 工具栏 */
    const renderToolbar = () =>
      h('div', { class: 'card-toolbar' }, [
        h('div', { class: 'card-toolbar-left' }, toolbarLeft()),
        h('div', { class: 'card-toolbar-center' }, toolbarTabs()),
        h('div', { class: 'card-toolbar-right' }, toolbarRight()),
      ]);

    /** 缩放控件 */
    const renderZoomControls = () =>
      h('div', { class: 'zoom-controls' }, [
        h('button', {
          class: 'zoom-btn',
          title: '放大',
          type: 'button',
          onClick: handleZoomIn,
          disabled: !canZoomIn.value,
          innerHTML: SVG_ICONS.zoomIn,
        }),
        h('button', {
          class: 'zoom-btn',
          title: '缩小',
          type: 'button',
          onClick: handleZoomOut,
          disabled: !canZoomOut.value,
          innerHTML: SVG_ICONS.zoomOut,
        }),
        h('span', {
          class: 'zoom-percent',
          onDblclick: resetView,
          title: '双击重置视图',
        }, `${zoom.value}%`),
      ]);

    /** 预览内容区 */
    const renderPreview = () => {
      const children = [];

      if (isMermaid.value) {
        children.push(h(MermaidRenderer, { key: 'mermaid-preview', code: rawCode.value }));
      }

      if (isEcharts.value) {
        let parsedConfig = null;
        try {
          // 优先尝试 JSON.parse（标准 JSON）
          const parsed = JSON.parse(rawCode.value);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            parsedConfig = parsed;
          }
        } catch {
          // JSON.parse 失败时，尝试用 new Function 解析（支持含 function 的 ECharts 配置）
          try {
            const fn = new Function(`return (${rawCode.value})`);
            const result = fn();
            if (result && typeof result === 'object' && Object.keys(result).length > 0) {
              parsedConfig = result;
            }
          } catch {
            // 两种方式都失败，显示 loading
          }
        }
        if (parsedConfig) {
          children.push(h(EChartsRenderer, { key: 'echarts-preview', config: parsedConfig }));
        } else {
          children.push(h(V3mdLoading));
        }
      }

      // Mermaid 渲染器内部会自行处理 loading 状态
      // 如果既不是 mermaid 也不是 echarts，显示 loading
      if (!isMermaid.value && !isEcharts.value) {
        children.push(h(V3mdLoading));
      }

      return h(
        'div',
        {
          ref: previewRef,
          class: 'v3md-card-preview-content',
          style: {
            transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value / 100})`,
            transformOrigin: 'center center',
            minHeight: '100px',
          },
          onMousedown: handleDragStart,
          onTouchstart: handleTouchStart,
          onTouchmove: handleTouchMove,
          onTouchend: handleTouchEnd,
        },
        children
      );
    };

    /** 源码内容区 */
    const renderSource = () =>
      h('div', { class: 'v3md-card-source-content' }, [
        h('pre', {}, [
          h('code', { class: langClass.value }, rawCode.value),
        ]),
      ]);

    /** 内容区 */
    const renderContent = () => {
      if (collapsed.value) return null;
      return h('div', {
        class: ['card-content', { 'is-dragging': isDragging.value }],
      }, [
        mode.value === 'preview' ? renderPreview() : renderSource(),
      ]);
    };

    /** 完整卡片 */
    const renderCard = () => {
      const children = [renderToolbar(), renderContent()];
      if (!collapsed.value && mode.value === 'preview') {
        children.push(renderZoomControls());
      }
      return h('div', { class: 'v3md-code-block-card' }, children);
    };

    // ---- 渲染 ----
    return () => {
      if (fullscreen.value) {
        return h(
          FullscreenOverlay,
          { onClose: () => { fullscreen.value = false; } },
          () => renderCard()
        );
      }
      return renderCard();
    };
  },
});
