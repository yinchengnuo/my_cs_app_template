<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { message, notification } from 'ant-design-vue'

dayjs.locale('zh-cn')

notification.config({ placement: 'bottomRight' })
message.config({ top: '45vh', maxCount: 1, duration: 2 })

window.addEventListener('keydown', (e) => e.key === 'F12' && require('electron').ipcRenderer.invoke('EVAL', 'window.webContents.toggleDevTools()'))
</script>

<template>
    <AConfigProvider :locale="zhCN">
        <RouterView />
    </AConfigProvider>
</template>

<style lang="scss">
@import '@/styles/index.scss';
</style>
