import { h, defineComponent, ref, watch, onMounted, onUnmounted, shallowRef } from 'vue';

const EChartsComponent = defineComponent({
  name: 'V3mdEcharts',
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

    const width = ref(props.config.width || '100%');
    const height = ref(props.config.height || '300px');

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
      if (newConfig.width) width.value = newConfig.width;
      if (newConfig.height) height.value = newConfig.height;
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
          style: { color: '#999', padding: '10px' },
        }, 'ECharts 加载失败，请确保已安装 echarts 依赖');
      }
      return h('div', {
        ref: chartRef,
        style: { width: width.value, height: height.value },
      });
    };
  },
});

export const echartsPlugin = {
  name: 'echarts',
  tagName: 'v3md-echarts',
  pattern: /\[\[echarts\s+([\s\S]*?)\]\]/g,
  component: EChartsComponent,
};
