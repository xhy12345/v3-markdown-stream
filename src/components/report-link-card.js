import { h, defineComponent } from 'vue';

const REPORT_LINK_TAG = 'v3md-report-link';

/** 文档图标 SVG */
const documentIcon = `<svg viewBox="0 0 1024 1024" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
  <path d="M146.863158 0h538.947368l296.421053 296.421053v619.789473c0 59.284211-48.505263 107.789474-107.789474 107.789474H146.863158c-59.284211 0-107.789474-48.505263-107.789474-107.789474V107.789474c0-59.284211 48.505263-107.789474 107.789474-107.789474z" fill="#2F77F1"/>
  <path d="M688.505263 0l296.421053 296.421053h-296.421053V0zM549.726316 661.557895H142.821053c-14.821053 0-25.6-12.126316-25.6-25.6V633.263158c0-14.821053 12.126316-25.6 25.6-25.6h406.905263c13.473684 0 25.6 12.126316 25.6 25.6v2.694737c0 13.473684-10.778947 25.6-25.6 25.6z m-134.736842-350.31579H142.821053c-14.821053 0-25.6-10.778947-25.6-25.6V282.947368c0-14.821053 12.126316-25.6 25.6-25.6h272.168421c13.473684 0 25.6 12.126316 25.6 25.6v2.694737c0 13.473684-10.778947 25.6-25.6 25.6z m-272.168421 121.263158h245.221052c13.473684 0 25.6 12.126316 25.6 25.6v2.694737c0 13.473684-12.126316 25.6-25.6 25.6H142.821053c-14.821053 0-25.6-10.778947-25.6-25.6V458.105263c0-14.821053 12.126316-25.6 25.6-25.6z" fill="#AFFCFE"/>
</svg>`;

/** 新窗口打开图标（保留备用） */
const externalLinkIcon = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
  <polyline points="15 3 21 3 21 9"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

/** 下载图标 */
const downloadIcon = `<svg viewBox="0 0 1024 1024" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
  <path d="M779.95324 65.291029 243.954663 65.291029c-98.579179 0-178.665169 79.997985-178.665169 178.709171l0 535.9996c0 98.713232 80.08599 178.711218 178.665169 178.711218l535.998577 0c98.755188 0 178.75522-79.997985 178.75522-178.711218L958.70846 244.0002C958.70846 145.289014 878.708428 65.291029 779.95324 65.291029zM869.374852 735.37751c0 73.977875-60.021002 133.912919-133.998877 133.912919L288.623002 869.290429c-73.979922 0-133.912919-59.935044-133.912919-133.912919L154.710083 288.667515c0-73.979922 59.932997-133.956921 133.912919-133.956921l446.752973 0c73.977875 0 133.998877 59.977 133.998877 133.956921L869.374852 735.37751zM288.623002 690.710194l446.752973 0 0 89.289606L288.623002 779.9998 288.623002 690.710194zM511.955486 646.043902 378.042567 467.376687l89.333608 0L467.376175 244.0002l89.245603 0 0 223.376487 89.421612 0L511.955486 646.043902z"/>
</svg>`;

/**
 * 报告文档链接卡片组件
 * 渲染包含 type=result 参数的链接为卡片形式，支持新窗口打开和下载
 */
export const ReportLinkCard = defineComponent({
  name: 'V3mdReportLinkCard',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    /** 从 node 属性中提取链接信息 */
    const getLinkInfo = () => {
      const rawUrl = props.node.properties?.dataUrl || props.node.properties?.['data-url'] || '';
      const rawText = props.node.properties?.dataText || props.node.properties?.['data-text'] || '';
      let url = '';
      let text = '';
      try { url = decodeURIComponent(rawUrl); } catch {}
      try { text = decodeURIComponent(rawText); } catch {}
      return { url, text };
    };

    /** 下载文件 */
    const handleDownload = (e) => {
      e.stopPropagation();
      const { url, text } = getLinkInfo();
      if (!url) return;

      // 从 URL 或文本推断文件名
      let filename = text.trim() || 'document';
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const lastSegment = pathname.split('/').pop();
        if (lastSegment && lastSegment.includes('.')) {
          filename = lastSegment;
        }
      } catch {
        // URL 解析失败，使用文本作为文件名
      }

      // 创建隐藏的 a 标签触发下载
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return () => {
      const { url, text } = getLinkInfo();

      return h('div', { class: 'v3md-report-link-card' }, [
        // 左侧：图标 + 文本（可点击）
        h(
          'a',
          {
            class: 'v3md-report-link-content',
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          [
            h('span', {
              class: 'v3md-report-link-icon',
              innerHTML: documentIcon,
            }),
            h('span', { class: 'v3md-report-link-text' }, text),
          ]
        ),
        // 右侧：下载按钮
        h('div', { class: 'v3md-report-link-actions' }, [
          h('span', {
            class: 'v3md-report-link-btn',
            innerHTML: downloadIcon,
            onClick: handleDownload,
          }),
        ]),
      ]);
    };
  },
});

export { REPORT_LINK_TAG };
