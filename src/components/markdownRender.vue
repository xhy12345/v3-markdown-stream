<template>
    <div class="v3_markdown_stream_render">
        <VueMarkdownStreamRender :markstr="markInfo"/>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';
import VueMarkdownStreamRender from "./markdown-parse.js";

let props = defineProps({
    markInfo: {
        type: String,
        require: true,
        default: ''
    }
})

</script>
<style lang="scss">
.v3_markdown_stream_render {
   --link-color: #0c5ccb;
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: rgba(106, 101, 101, 0.5);
    }
    * {
        animation: fade-in 0.6s ease-in-out;
    }
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    a {
        color: var(--link-color);
        text-decoration:none;
    }
    ul {
        list-style-type: disc
    }
    .remark-container {
        margin: 10px 0;
        padding: 15px 10px;
        border-radius: 5px;
        &.warning{
            background-color: rgb(255 145 0 / 6%);
            border-left: 5px solid #ff9100;
        }
        &.tip {
            background-color: rgb(0 191 165 / 6%);
            border-left: 5px solid #00bfa5;
        }
        &.error {
            background-color: rgb(255 82 82 / 6%);
            border-left:  5px solid #ff5252;
        }
    }
    .katex-display {
        overflow-x: scroll;
        overflow-y: hidden;
    }
    img {
        max-width: 100%;
    }
    pre {
        position: relative;
        border-radius: 4px;
        overflow-x: auto;
    }
    table {
        margin: 10px 0;
        width: 100%;
        display: block;
        overflow-x: scroll;
        border-collapse: collapse;
    }
    td, th {
        border: 1px solid #000;
        padding: 5px 10px;
        min-width: 40px;
    }
    tbody tr:nth-child(odd) {
        background-color: #eee;
    }
    blockquote {
        display: block;
        font-weight: 500;
        font-style: italic;
        border-left: 5px solid #e2e8f0;
        quotes: "\201C" "\201D" "\2018" "\2019";
        padding-left: 1em;
        margin: 10px;
    }
}
</style>