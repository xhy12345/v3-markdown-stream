<template>
  <div class="page">
    <div class="mark_content" ref="messageContent" @wheel="touchmove">
      <MarkdownRender :markInfo="markInfo" themeColor="#000000"/>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import MarkdownRender from "./components/markdownRender.vue"
  import { streamContent } from './markdown.ts';
  let markInfo = ref('')
  let auoScroll = ref(true);
  const messageContent = ref()// 消息体窗口

  const touchmove = (e)=> {
    if(e.deltaY < 0){
      auoScroll.value = false;
    } else {
      auoScroll.value = true;
    }
  }
  const main = async () => {
    const source_txt = streamContent;
    let i = 0
    while (i < source_txt.length) {
        const length = Math.floor(Math.random() * 20) + 1
        const delay  = Math.floor(Math.random() * 200) + 10
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
      content.scroll({
        top: content.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
  onMounted(() => {
    main();
  })

</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
        
}
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: rgba(106, 101, 101, 0.5);
}
.mark_content {
  position: fixed;
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
