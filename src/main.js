import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.mount('#app')

import './cssreset.css'
import './markdown/markdown.js'
import './markdown/markdown.css'
import './markdown/markdown-editor.css'
export default app

