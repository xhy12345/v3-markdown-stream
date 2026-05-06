import { h, defineComponent, inject } from 'vue';

const REF_CLICK_KEY = Symbol('v3md-ref-click');

const RefTag = defineComponent({
  name: 'V3mdRef',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  setup(props, { slots }) {
    const onRefClick = inject(REF_CLICK_KEY, null);

    const extractRefNumbers = (node) => {
      const texts = [];
      const walk = (n) => {
        if (n.type === 'text') {
          texts.push(n.value);
        }
        if (n.children) {
          n.children.forEach(walk);
        }
      };
      walk(node);
      const text = texts.join('');
      const match = text.match(/\[(\d+(?:\s*,\s*\d+)*)\]/);
      if (match) {
        return match[1].split(/\s*,\s*/).map(Number);
      }
      return [];
    };

    return () => {
      const numbers = extractRefNumbers(props.node);
      return h(
        'ref',
        {
          onClick: (e) => {
            e.stopPropagation();
            if (onRefClick && numbers.length > 0) {
              onRefClick(numbers);
            }
          },
        },
        slots.default ? slots.default() : undefined
      );
    };
  },
});

export { RefTag, REF_CLICK_KEY };
