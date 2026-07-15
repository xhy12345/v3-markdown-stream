import { h, defineComponent, ref, watch, onMounted, onUnmounted, shallowRef } from 'vue';

/**
 * ECharts 纯渲染器组件
 * 只负责将 ECharts config 渲染为图表，不包含任何 UI 包装（工具栏、按钮等由 CodeBlockCard 管理）
 */
export const EChartsRenderer = defineComponent({
  name: 'V3mdEchartsRenderer',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const chartRef = ref(null);
    const chartInstance = shallowRef(null);
    const initFailed = ref(false);

    let lastConfigJson = '';

    const getOption = (config) => {
      const { type, data, width: _w, height: _h, ...rest } = config;
      const option = { ...rest };

      if (type && !option.series) {
        option.series = [{ type, data: data || [] }];
      }

      if (!option.xAxis && !option.yAxis && type === 'bar') {
        option.xAxis = { type: 'category', data: (data || []).map((_, i) => `${i + 1}`) };
        option.yAxis = { type: 'value' };
        option.series = [{ type, data: data || [] }];
      }

      if (!option.xAxis && !option.yAxis && type === 'line') {
        option.xAxis = { type: 'category', data: (data || []).map((_, i) => `${i + 1}`) };
        option.yAxis = { type: 'value' };
        option.series = [{ type, data: data || [] }];
      }

      if (!option.tooltip) {
        option.tooltip = {};
      }

      return option;
    };

    const initChart = async () => {
      if (!chartRef.value) return;
      try {
        const echarts = await import('echarts');
        chartInstance.value = echarts.init(chartRef.value);
        chartInstance.value.setOption(getOption(props.config));
        lastConfigJson = JSON.stringify(props.config);
      } catch (e) {
        initFailed.value = true;
      }
    };

    const updateChart = (newConfig) => {
      if (!chartInstance.value) return;
      const newJson = JSON.stringify(newConfig);
      if (newJson === lastConfigJson) return;
      lastConfigJson = newJson;
      chartInstance.value.setOption(getOption(newConfig));
    };

    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.dispose();
        chartInstance.value = null;
      }
    });

    watch(
      () => props.config,
      (newConfig) => {
        if (chartInstance.value && newConfig) {
          updateChart(newConfig);
        }
      }
    );

    return () => {
      if (initFailed.value) {
        return h('div', {
          style: { color: '#999', padding: '20px', textAlign: 'center', fontSize: '13px' },
        }, 'ECharts 加载失败，请确保已安装 echarts 依赖');
      }
      return h('div', {
        ref: chartRef,
        class: 'v3md-echarts-renderer',
        style: { width: '100%', height: '300px' },
      });
    };
  },
});

/**
 * 兼容 [[echarts ...]] 插件语法的包装组件
 * 将 config 转发给 EChartsRenderer
 */
const EChartsLegacyWrapper = defineComponent({
  name: 'V3mdEchartsLegacy',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => h(EChartsRenderer, { config: props.config });
  },
});

export const echartsPlugin = {
  name: 'echarts',
  tagName: 'v3md-echarts',
  pattern: /\[\[echarts\s+([\s\S]*?)\]\]/g,
  component: EChartsLegacyWrapper,
};
