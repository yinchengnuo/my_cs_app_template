import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import Form from '@/components/Form'
import Table from '@/components/Table'
import SSTable from '@/components/SSTable'

import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(store).use(router).use(Antd).use(Form).use(Table).use(SSTable)

app.config.globalProperties.window = window
app.config.globalProperties.log = console.log

app.mount('#app')
