import { h, defineComponent, ref, watch} from "vue";
import { exportToExcel } from 'html-to-office';
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
    const uniqueId = ref(`table_${String(new Date().getTime()) + String(Math.floor(Math.random() * 1000))}`);
    const NodeInfo = ref(props.node);
    NodeInfo.value.properties.id = uniqueId;
    
    watch(props,(nval) => {
      NodeInfo.value = nval.node
      NodeInfo.value.properties.id = uniqueId;
    })
    
    const renderNode = (node) => {
      if (node.type === 'text') return node.value
      const { tagName, properties, children = [] } = node
      return h(
        tagName,
        properties, 
        children.map(renderNode)
      )
    }
    const handelClick = () => {
      exportToExcel(uniqueId.value)
    }
    return () => {
      return h('div', {class: 'table_div'} , [
        h('div',{class: 'download_btn'},h('img',{ src: outPutImg, onClick: handelClick, title: '导出'})),
        renderNode(NodeInfo.value)
      ])
    }
  }
})