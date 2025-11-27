<template>
  <div class="page">
    <div class="mark_content" ref="messageContent">
      <MarkdownRender :markInfo="markInfo"/>
      <div class="bottom_position"> </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import MarkdownRender from "./components/markdownRender.vue"
  import { streamContent } from './markdown.ts';
  let markInfo = ref('')
  let auoScroll = ref(true);
  const intersectionObsever = ref();
  const messageContent = ref()// 消息体窗口


  const main = async () => {
    const source_txt = streamContent;
    let i = 0
    while (i < source_txt.length) {
        const length = Math.floor(Math.random() * 20) + 1
        const delay  = Math.floor(Math.random() * 300) + 10
        const chunk  = source_txt.slice(i, i += length)
        await new Promise(resolve => setTimeout(resolve, delay))
        markInfo.value += chunk;
        if(auoScroll.value) {
          nextTick(() => {
            scrollToBottom();
          })
        }
    }
  }

  function scrollToBottom() {
    const content = messageContent.value;
    if (content) {
      content.scrollTop = content.scrollHeight
    }
  }
  function listenViewInDevice() {
    intersectionObsever.value = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio > 0) {
        auoScroll.value = true;
      }
      else {
        auoScroll.value = false;
      }
    })
    intersectionObsever.value.observe(document.querySelector('.bottom_position'))
  }
  onMounted(() => {
    main();
    if (document.querySelector('.bottom_position')) {
      nextTick(() => {
        listenViewInDevice()
      })
    }
  })
  onUnmounted(() => {
    if (document.querySelector('.bottom_position')) {
      intersectionObsever.value.disconnect()
    }
  })

</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
}
.mark_content {
  width: 80vw;
  height: 90vh;
  overflow-y: scroll;
  border-radius: 10px;
  transition: all 0.5s;
  padding: 20px;
  border: 1px solid #eee;
  box-shadow: 0 0 5px gray;
}
</style>
