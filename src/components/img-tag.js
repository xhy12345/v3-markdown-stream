import { defineComponent, h } from 'vue';

/**
 * 自定义 img 组件
 * 从 src URL 的查询参数中提取 w 和 h，作为图片的宽高
 * 例如: https://example.com/img.jpg?w=200&h=100 → width: 200px, height: 100px
 */
const ImgTag = defineComponent({
  name: 'V3mdImg',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  setup(props) {
    return () => {
      const style = {borderRadius: '8px'};
      if (props.src) {
        try {
          const url = new URL(props.src);
          const w = url.searchParams.get('w');
          const h = url.searchParams.get('h');
          if (w) style.width = w + 'px';
          if (h) style.height = h + 'px';
        } catch (e) {
          // 相对路径或无效 URL，忽略
        }
      }

      const attrs = {
        src: props.src,
        alt: props.alt,
      };
      if (props.title) attrs.title = props.title;
      if (Object.keys(style).length > 0) attrs.style = style;

      return h('img', attrs);
    };
  },
});

export { ImgTag };
