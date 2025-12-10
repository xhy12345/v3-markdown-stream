import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App);
app.config.warnHandler = () => {};
app.mount('#app')
