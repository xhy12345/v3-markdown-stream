import { h, defineComponent } from 'vue';

const V3mdLoading = defineComponent({
  name: 'V3mdLoading',
  setup() {
    return () =>
      h('div', { class: 'v3md-loading' }, [
        h('div', { class: 'three-body' }, [
          h('div', { class: 'three-body__dot' }),
          h('div', { class: 'three-body__dot' }),
          h('div', { class: 'three-body__dot' }),
        ]),
      ]);
  },
});

export { V3mdLoading };

export const LOADING_TAG = 'v3md-loading';

export const LOADING_HTML = `<${LOADING_TAG}></${LOADING_TAG}>`;
