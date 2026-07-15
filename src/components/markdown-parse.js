import { h, defineComponent, createVNode, computed, provide, inject } from "vue";
import { Fragment, jsxs, jsx } from "vue/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import TableCode from './tableCode';
import PreCode from './preCode';
import { V3mdLoading, LOADING_TAG } from './loading.js';
import { RefTag, REF_CLICK_KEY } from './ref-tag.js';
import { ImgTag } from './img-tag.js';
import { CODE_BLOCK_CARD_TAG, CodeBlockCard } from './code-block-card.js';
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
        },
        pluginRegistry: {
            type: Object,
            default: null
        },
        onRefClick: {
            type: Function,
            default: null
        }
    },
    errorCaptured(e) {
        console.error("解析报错", e);
    },
    setup(props) {
        provide(REF_CLICK_KEY, (numbers) => {
            if (props.onRefClick) {
                props.onRefClick(numbers);
            }
        });
        let unifiedProcessor = computed(() => {
            const processor = unified()
                .use(remarkParse, { allowDangerousHtml: true})
                .use(remarkFlexibleContainers)
                .use(remarkRehype, { allowDangerousHtml: true})
                .use(rehypeRaw)
                .use(remarkGfm)
                .use(rehypeKatex)
                .use(remarkMath)
                .use(rehypeHighlight);

            return processor;
        });

        const createFile = (markstr) => {
            const file = new VFile();
            file.value = markstr;
            return file;
        };

        const generateVueNode = (tree) => {
            const baseComponents = {
                table: TableCode,
                pre: PreCode,
                img: ImgTag,
                [LOADING_TAG]: V3mdLoading,
                ref: RefTag,
                [CODE_BLOCK_CARD_TAG]: CodeBlockCard,
            };
            const pluginComponents = props.pluginRegistry
                ? props.pluginRegistry.getComponentMappings()
                : {};
            const vueVnode = toJsxRuntime(tree, {
                components: {
                    ...baseComponents,
                    ...pluginComponents,
                },
                Fragment,
                jsx: jsx,
                jsxs: jsxs,
                passNode: true,
            });
            return vueVnode;
        };

        const computedVNode = computed(() => {
            if(props.markstr) {
                const processor = unifiedProcessor.value;
                let markdown = props.markstr;
                if (props.pluginRegistry) {
                    markdown = props.pluginRegistry.transformMarkdown(markdown);
                }
                const file = createFile(markdown);
                let result = generateVueNode(processor.runSync(processor.parse(file), file));
                return result;
            } else {
                return createVNode('div',null,null);
            }
        });

        return () => {
            return h(computedVNode.value);
        };
    }
})