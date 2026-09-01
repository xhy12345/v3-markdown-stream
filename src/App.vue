<template>
  <div class="page">
    <div class="page-title">v3-markdown-stream</div>
    <div class="page-desc">一个基于 Vue 3 的高性能 Markdown 流式渲染组件，支持增量输出、无闪屏、无卡顿，样式友好。</div>
    <div class="panel-container">
      <div class="panel">
        <div class="panel-header">渲染结果</div>
        <div class="panel-body" ref="messageContent" @wheel="touchmove">
          <MarkdownRender :markInfo="markInfo" themeColor="#5D3FD3" :onRefClick="handleRefClick"/>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">Markdown 源码</div>
        <div class="panel-body source-body" ref="sourceContent" @wheel="touchmove">
          <pre class="source-code">{{ markInfo }}</pre>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import MarkdownRender from "./components/markdownRender.vue"
  import { streamContent } from './markdown.ts';

  let markInfo = ref('')
  let auoScroll = ref(true);
  const messageContent = ref()
  const sourceContent = ref()

  const touchmove = (e)=> {
    if(e.deltaY < 0){
      auoScroll.value = false;
    } else {
      auoScroll.value = true;
    }
  }
  const handleRefClick = (numbers) => {
    console.log('点击了引用:', numbers) // 例如 [3] 或 [1, 2, 3]
  }

  const main = async () => {
    // markInfo.value = streamContent;
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
    const source = sourceContent.value;
    if (content) {
      content.scroll({
        top: content.scrollHeight,
        behavior: 'smooth'
      })
    }
    if (source) {
      source.scroll({
        top: source.scrollHeight,
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
  height: calc(100vh - 16px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  position:relative;
  background: linear-gradient(135deg, #ebadb6 0%, #aceae1 100%);
  border-radius: 7px;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}
.page-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1a1a2e;
  font-style: italic;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  margin-bottom: 4px;
}
.page-desc {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  letter-spacing: 0.2px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  margin-bottom: 16px;
}
.panel-container {
  display: flex;
  gap: 16px;
  flex-grow: 1;
  height: 0;
}
.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.panel-header {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
}
.source-body {
  background: #fafafa;
}
.source-code {
  margin: 0;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: #333;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: rgba(106, 101, 101, 0.5);
}
</style>
