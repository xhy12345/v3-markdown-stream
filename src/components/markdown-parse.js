import { h, defineComponent, computed } from "vue";
import { Fragment, jsxs, jsx } from "vue/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import remarkParse from "remark-parse";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import 'highlight.js/styles/github-dark.css';
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight'
import remarkFlexibleContainers from 'remark-flexible-containers'
import remarkGfm from "remark-gfm";
import { VFile } from "vfile";
import { unified } from "unified";

export default defineComponent({
    name: 'VueMarkdownStreamRender',
    props: {
        markstr: {
            type: String,
            required: true,
            default: ''
        }
    },
    errorCaptured(e) {
        console.error("解析报错", e);
    },
    setup(props) {
        let unifiedProcessor = computed(() => { // unified解析器工具链初始化
            const processor = unified()
                .use(remarkParse, { allowDangerousHtml: true})
                .use(remarkRehype, { allowDangerousHtml: true})
                .use(rehypeRaw)
                .use(remarkFlexibleContainers)
                .use(remarkGfm)
                .use(rehypeKatex)
                .use(remarkMath)
                .use(rehypeHighlight);

            return processor;
        });

        const createFile = (markstr) => { // markdown字符串转file
            const file = new VFile();
            file.value = markstr;
            return file;
        };

        const generateVueNode = (tree) => { // 获取vue虚拟dom
            const vueVnode = toJsxRuntime(tree, {
                Fragment,
                jsx: jsx,
                jsxs: jsxs,
                passNode: true,
            });
            return vueVnode;
        };

        const computedVNode = computed(() => {
            const processor = unifiedProcessor.value;
            const file = createFile(props.markstr);
            let result = generateVueNode(processor.runSync(processor.parse(file), file));
            return result;
        });

        return () => {
            return h(computedVNode.value);
        };
    }
})