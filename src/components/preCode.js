import { h, defineComponent, ref, watch} from "vue";
/**
 * 自定义表格
 */
export default defineComponent({
  name: 'preCode',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const uniqueId = ref(`pre_${String(new Date().getTime()) + String(Math.floor(Math.random() * 1000))}`);
    const NodeInfo = ref(props.node);
    NodeInfo.value.properties.id = uniqueId;

    watch(props,(nval) => {
      NodeInfo.value = nval.node
      NodeInfo.value.properties.id = uniqueId;
    })

    const normalizeProps = (properties = {}) => {
      const props = { ...properties }
      if (Array.isArray(props.className)) {
        props.class = props.className.join(' ')
        delete props.className
      }
      return props
    }

    const renderNode = (node) => {
      if (node.type === 'text') return node.value
      const { tagName, properties, children = [] } = node
      const normalizedProps = normalizeProps(properties)
      return h(
        tagName,
        normalizedProps, 
        children.map(renderNode)
      )
    }

    const handelClick = () => {
      let text = document.getElementById(uniqueId.value).innerText;
      let copyBtn = document.querySelector(`#copy_${uniqueId.value}`);
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerText = '已复制!';
        setTimeout(() => {
          copyBtn.innerText = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('复制失败:', err);
        copyBtn.innerText = '复制失败';
        setTimeout(() => {
          copyBtn.innerText = 'Copy';
        }, 2000);
      });
    }

    return () => {
      return h('div', {class: 'pre_div'} , [
        h('div',{class: 'copy_btn'},h('div',{title:'复制',class:'copy_info',id:`copy_${uniqueId.value}`, onClick: handelClick}, 'Copy')),
        renderNode(NodeInfo.value)
      ])
    }
  }
})