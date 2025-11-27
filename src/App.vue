<template>
  <div>
    <MarkdownRender :markInfo="markInfo"/>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import MarkdownRender from "./components/markdownRender.vue"
  import { streamContent } from './markdown.ts';
  let markInfo = ref('')

  const main = async () => {
    const source_txt = streamContent;
    let i = 0
    while (i < source_txt.length) {
        const length = Math.floor(Math.random() * 20) + 1
        const delay  = Math.floor(Math.random() * 80) + 10
        const chunk  = source_txt.slice(i, i += length)
        await new Promise(resolve => setTimeout(resolve, delay))
        markInfo.value += chunk;
    }
  }

  onMounted(() => {
    main();
  })

</script>

<style scoped>
</style>
