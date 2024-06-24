<script setup>
import Store from '@/store'
import Router from '@/router'
import Encrypt from '@/utils/Encrypt'
import { modalConfirm } from '@/utils'
import { SerialMap } from '@/utils/WebSerial'
import { message, Modal } from 'ant-design-vue'
import LocalStorage from '@/utils/LocalStorage'
import { apiChangePsw, apiLayout } from '@/api/登录'
import { reactive, watch, ref, nextTick } from 'vue'
import { ApiOutlined, ReloadOutlined } from '@ant-design/icons-vue'

const mini = () => {
    require('electron').ipcRenderer.invoke(
        'EVAL',
        `if (process.platform === 'darwin') {
            window.setFullScreen(false)
            window.once('leave-full-screen', () => {
                window.once('restore', () => window.setFullScreen(true))
                window.minimize()
            })
        } else {
            window.minimize()
        }`
    )
}

const close = async () => {
    require('electron').ipcRenderer.invoke('EVAL', 'app.quit()')
}

const changePassword = reactive({
    data: {},
    visible: false
})

watch(
    () => changePassword.visible,
    (n) => {
        if (n) {
            changePassword.data = {}
        }
    }
)

const FORM = ref()
const change = () => {
    FORM.value.validate().then((value) => {
        if (value.newPassword !== value.newPassword1) return message.warning('两次输入的新密码不一致')
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,}$/.test(value.newPassword)) return message.warning('密码必须是包含大小写字母/数字的8位以上组合')
        if (['my', 'muyuan', '002714'].some((e) => value.newPassword.toLocaleLowerCase().includes(e))) return message.warning('密码不能包含牧原相关信息')
        if (value.newPassword.includes(Store.state.userinfo.account)) return message.warning('密码不能包含工号信息')
        const params = {
            code: Store.state.userinfo.all?.code,
            oldPassword: Encrypt.en(value.oldPassword),
            password: Encrypt.en(value.newPassword)
        }
        apiChangePsw(params).then(() => {
            changePassword.visible = false
            Modal.info({
                centered: true,
                keyboard: false,
                okText: '重新登录',
                title: () => '提示',
                content: () => '修改成功后需要重新登录',
                onOk() {
                    Router.replace('/登录')
                }
            })
        })
    })
}
const reload = () => window.location.reload()

const clearCache = async () => {
    const cacheLen = +(JSON.stringify(Object.assign(JSON.parse(JSON.stringify(LocalStorage.raw)), { zoom: undefined, login: undefined })).length / 1024).toFixed(2)
    if (cacheLen === 0) {
        return message.info('暂无缓存信息')
    }
    if (await modalConfirm(`确定清空所有缓存数据（${cacheLen}KB）？`)) {
        const envs = LocalStorage.getItem('envs')
        const zoom = LocalStorage.getItem('zoom')
        const login = LocalStorage.getItem('login')
        LocalStorage.clear()
        LocalStorage.setItem('envs', envs)
        LocalStorage.setItem('zoom', zoom)
        LocalStorage.setItem('login', login)
        message.success('清除完成, 页面即将刷新')
        setTimeout(() => require('electron').ipcRenderer.invoke('EVAL', 'window.webContents.reloadIgnoringCache()'), 1234)
    }
}

const clearLogin = async () => {
    if (await modalConfirm('确定退出登录并清除记住密码？')) {
        Store.commit('userinfo/CLEAR')
        message.success('登录信息清除成功')
    }
}

const logout = async () => {
    if (await modalConfirm('确定退出登录？')) {
        apiLayout().then(() => {
            Router.replace('/登录')
            nextTick(() => location.reload())
        })
    }
}

const getDeviceName = (portName) => {
    return (Object.values(SerialMap).find((e) => e.serialPort === portName) || { ...(LocalStorage.getItem(portName) || {}) })?.name || '-'
}

const requestPort = (visible) => {
    if (visible) {
        navigator.serial.requestPort().catch(() => {})
        document.body.click()
    }
}
</script>

<template>
    <a-modal v-model:open="changePassword.visible" title="修改密码" destroyOnClose width="360px" centered @ok="change">
        <Form ref="FORM" v-model="changePassword.data" width="300px" hideRight spaceY="20px">
            <FormInput password name="oldPassword" label="旧密码" placeholder="请输入旧密码" :rules="[{ required: true, message: '请输入旧密码', whitespace: true }]" />
            <FormInput password name="newPassword" label="新密码" placeholder="请输入新密码" :rules="[{ required: true, message: '请输入新密码', whitespace: true }]" />
            <FormInput password name="newPassword1" label="新密码" placeholder="请再次输入新密码" :rules="[{ required: true, message: '请再次输入新密码', whitespace: true }]" />
        </Form>
    </a-modal>
    <div class="title_bar_right h100 flex flex_fe">
        <a-popover overlayClassName="choose_serial" destroyTooltipOnHide trigger="click" v-if="Store.state.serial.all.length" @openChange="requestPort">
            <template #title>
                <div class="flex flex_sb">
                    <span>串口设备</span>
                    <ReloadOutlined @click="requestPort(true)" />
                </div>
            </template>
            <template #content>
                <Table width="546px" :data="Store.state.serial.all" auto>
                    <TableColumn width="220" title="串口名称" dataIndex="portName" />
                    <TableColumn width="210" title="设备名称">
                        <template #default="{ record: { portName } }">{{ getDeviceName(portName) }}</template>
                    </TableColumn>
                    <TableColumn width="98" title="是否连接">
                        <template #default="{ record: { portName } }">
                            <a-tag v-if="SerialMap[getDeviceName(portName)]" color="success">是</a-tag>
                            <a-tag v-else>否</a-tag>
                        </template>
                    </TableColumn>
                </Table>
            </template>
            <ApiOutlined class="mr16 port" style="font-size: 16px" />
        </a-popover>
        <a-button type="link" style="padding: 0" class="mr8" @click="require('electron').shell.openExternal(Store.state.app.feedback)">线上问题受理</a-button>

        <span v-if="Store.state.userinfo.all" type="link" style="font-weight: 400; font-size: 14px; color: #565169">{{ Store.state.userinfo.facName }}</span>

        <a-dropdown v-if="Store.state.userinfo.all">
            <a-button type="link" style="padding: 0">
                <div class="flex">
                    <img src="@/assets/layout/user.png" width="16" style="margin: 0 4px 0 11px" />
                    <span style="line-height: 1">{{ Store.state.userinfo.all?.nickName || Store.state.userinfo.all?.account }}</span>
                </div>
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="$router.push('/首页')">首页</a-menu-item>
                    <a-menu-item @click="changePassword.visible = true">修改密码</a-menu-item>
                    <a-menu-item @click="clearCache">清除缓存</a-menu-item>
                    <a-menu-item @click="clearLogin">清除登录</a-menu-item>
                    <a-menu-item @click="logout">退出登录</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <img class="pointer" width="22" src="@/assets/layout/zoomOut.png" style="margin-left: 30px" @click="Store.commit('app/ZOOM_APP', { zoom: Store.state.app.zoom + 0.1, byHand: true })" />
        <img class="pointer" width="22" src="@/assets/layout/refresh.png" style="margin-left: 10px" @click="reload" />
        <img class="pointer" width="22" src="@/assets/layout/zoomIn.png" style="margin-left: 10px" @click="Store.commit('app/ZOOM_APP', { zoom: Store.state.app.zoom - 0.1, byHand: true })" />
        <img class="pointer" width="22" src="@/assets/layout/mini.png" style="margin-left: 30px" @click="mini" />
        <img class="pointer" width="22" src="@/assets/layout/close.png" style="margin-left: 10px" @click="close" />
    </div>
</template>

<style lang="scss" scoped>
@keyframes port {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.port {
    font-size: 20px !important;
    animation: port 2s infinite;
}
</style>
