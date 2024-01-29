import { createApp } from 'vue'
import App from './App.vue'
import './assets/reset.css'
import './assets/fonts/iconfont.css'
// 引入可伸缩布局方案
import 'amfe-flexible'
import router from './router'

const app=createApp(App)
app.use(router)
app.mount('#app')