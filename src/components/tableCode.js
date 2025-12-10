import { h, defineComponent, createVNode, computed } from "vue";
import outPutImg from '../assets/out_put.png'

/**
 * 自定义表格
 */
export default defineComponent({
  name: 'TableCode',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const renderNode = (node) => {
      if (node.type === 'text') return node.value
      const { tagName, properties, children = [] } = node
      return h(
        tagName,
        properties, 
        children.map(renderNode)
      )
    }
    return () => {
      return h('div', {class: 'table_div'} , [
        h('div',{class: 'download_btn'},h('img',{ src: outPutImg, title: '导出'})),
        renderNode(props.node)
      ])
    }
  }
})