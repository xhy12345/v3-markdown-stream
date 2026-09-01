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

    const defaultColors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];

    const applyDefaults = (option) => {
      // 颜色
      if (!option.color) option.color = defaultColors;

      // 网格
      if (!option.grid) {
        option.grid = { left: '3%', right: '4%', bottom: '8%', top: '15%', containLabel: true };
      }

      // tooltip
      if (!option.tooltip) {
        option.tooltip = {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          textStyle: { color: '#333', fontSize: 12 },
          extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 6px;',
        };
      } else if (option.tooltip.trigger === 'item') {
        // pie 等 item 触发类型
        if (!option.tooltip.backgroundColor) option.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
        if (!option.tooltip.borderColor) option.tooltip.borderColor = '#e0e0e0';
        if (!option.tooltip.textStyle) option.tooltip.textStyle = { color: '#333', fontSize: 12 };
        if (!option.tooltip.extraCssText) option.tooltip.extraCssText = 'box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 6px;';
      }

      // legend
      if (option.legend !== false && !option.legend) {
        option.legend = {
          textStyle: { color: '#666', fontSize: 12 },
          itemWidth: 14,
          itemHeight: 8,
          icon: 'roundRect',
        };
      }

      if(option.legend.top === undefined) option.legend.top = 32;

      // xAxis 默认值
      if (option.xAxis) {
        const axes = Array.isArray(option.xAxis) ? option.xAxis : [option.xAxis];
        axes.forEach((axis) => {
          if (!axis.axisLine) axis.axisLine = { lineStyle: { color: '#e0e0e0' } };
          if (!axis.axisTick) axis.axisTick = { show: false };
          if (!axis.axisLabel) axis.axisLabel = { color: '#666', fontSize: 11, rotate: 0 };
          if (!axis.splitLine) axis.splitLine = { show: false };
          if (!axis.splitArea) axis.splitArea = { show: false };
        });
      }

      // yAxis 默认值
      if (option.yAxis) {
        const axes = Array.isArray(option.yAxis) ? option.yAxis : [option.yAxis];
        axes.forEach((axis) => {
          if (!axis.axisLine) axis.axisLine = { show: false };
          if (!axis.axisTick) axis.axisTick = { show: false };
          if (!axis.axisLabel) axis.axisLabel = { color: '#666', fontSize: 11 };
          if (!axis.splitLine) axis.splitLine = { lineStyle: { color: '#f0f0f0', type: 'dashed' } };
          if (!axis.splitArea) axis.splitArea = { show: false };
        });
      }

      // series 默认值
      if (option.series) {
        const series = Array.isArray(option.series) ? option.series : [option.series];
        series.forEach((s) => {
          // 折线图
          if (s.type === 'line') {
            if (s.smooth === undefined) s.smooth = true;
            if (!s.symbol) s.symbol = 'circle';
            if (s.symbolSize === undefined) s.symbolSize = 6;
            if (!s.lineStyle) s.lineStyle = { width: 2.5 };
            if (!s.areaStyle && s.areaStyle !== false) {
              s.areaStyle = {
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(84,112,198,0.15)' },
                    { offset: 1, color: 'rgba(84,112,198,0.01)' },
                  ],
                },
              };
            }
            if (!s.emphasis) s.emphasis = { focus: 'series' };
          }
          // 柱状图
          if (s.type === 'bar') {
            if (!s.barMaxWidth) s.barMaxWidth = 35;
            if (!s.itemStyle) s.itemStyle = {};
            if (s.itemStyle.borderRadius === undefined) s.itemStyle.borderRadius = [4, 4, 0, 0];
            if (!s.emphasis) s.emphasis = { focus: 'series' };
          }
          // 饼图
          if (s.type === 'pie') {
            if (!s.radius) s.radius = ['40%', '70%'];
            if (!s.avoidLabelOverlap) s.avoidLabelOverlap = true;
            if (!s.itemStyle) s.itemStyle = {};
            if (!s.itemStyle.borderRadius) s.itemStyle.borderRadius = 6;
            if (!s.itemStyle.borderColor) s.itemStyle.borderColor = '#fff';
            if (!s.itemStyle.borderWidth) s.itemStyle.borderWidth = 2;
            if (!s.label) s.label = { show: false };
            if (!s.emphasis) {
              s.emphasis = {
                label: { show: true, fontSize: 13, fontWeight: 600 },
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
              };
            }
          }
        });
      }

      // title
      if (option.title && !option.title.textStyle) {
        option.title.textStyle = { fontSize: 14, fontWeight: 600, color: '#333' };
      }
      if (option.title && !option.title.left) option.title.left = 'center';
      if (option.title && !option.title.top) option.title.top = 8;

      // animation
      if (option.animation === undefined) option.animationDuration = 800;

      return option;
    };

    const getOption = (config) => {
      const { type, data, width: _w, height: _h, ...rest } = config;
      let option = { ...rest };

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

      option = applyDefaults(option);
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
