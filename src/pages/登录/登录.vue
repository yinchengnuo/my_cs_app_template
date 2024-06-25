<script setup>
import { ref } from 'vue'
import Store from '@/store'
import Router from '@/router'
import DllPrint from '@/utils/DllPrint'
import { makeEnum, modalConfirm } from '@/utils'

const refForm = ref()

if (!Store.state.userinfo.remember) {
    Store.commit('userinfo/GOT_USERINFO', { account: '', password: '', level: undefined })
}

if (Store.state.userinfo.urlIp && !Store.state.env.render.find((e) => e.urlIp === Store.state.userinfo.urlIp)) {
    Store.commit('userinfo/GOT_USERINFO', { urlIp: Store.state.env.render[0].urlIp })
}

const login = () => {
    refForm.value
        .validate()
        .then(() => {
            Router.replace('/首页')
            sessionStorage.setItem('tab', '[]')
        })
        .catch(() => {})
}

const switchEnv = async (url, { tag }) => {
    if (await modalConfirm(`确定切换至${envs.find((e) => e.value === url)?.label}？切换后应用会立即重启！`)) {
        const fs = require('fs')
        const path = require('path')
        const appPath = path.join(process.resourcesPath, '/app/dist/index.js')
        fs.writeFileSync(
            appPath,
            fs
                .readFileSync(appPath)
                .toString()
                .replace(/(?<=const ENV(| )=(| )('|")).+?(?=('|"))/, tag)
        )
        require('electron').ipcRenderer.invoke('EVAL', `app.relaunch();app.exit();`)
    }
}

const URL = location.origin + (location.pathname === '/' ? '' : location.pathname)
const envs = makeEnum(
    Store.state.env.main.filter((e) => e.tag !== '' && e.tag !== 'local'),
    'name',
    'url'
)

const open = ref(undefined)
const RefSpeechUsername = ref()
const RefSpeechPassword = ref()
const RefSpeechFactory = ref()
</script>

<template>
    <div class="h100 flex index">
        <img src="@/assets/login/loginbg.png" />
        <div class="content flex">
            <div class="left h100">
                <img src="@/assets/login/loginlogo.png" />
            </div>
            <div class="right h100 flex1 flexc flex_fs">
                <img class="logo" src="@/assets/login/logo.png" width="86" height="32" />
                <div class="title flex">
                    <a-select v-if="Store.state.app.isPackaged && Store.state.env.env.tag" :value="URL" :options="envs" style="width: 158px; margin-right: 4px" @change="switchEnv" />
                    <span v-else style="color: red; font-weight: bolder">{{ Store.state.env.env.name }}</span>
                    <span>{{ Store.state.app.appName }}</span>
                </div>
                <a-form ref="refForm" :model="Store.state.userinfo" hideRequiredMark>
                    <a-form-item name="account" :rules="[{ required: true, message: '请输入账号', whitespace: true }]">
                        <a-input ref="RefSpeechUsername" v-model:value.trim="Store.state.userinfo.account" autoFocus size="large" placeholder="账号" style="width: 300px" @pressEnter="login">
                            <template #prefix>
                                <img src="@/assets/login/acc.png" width="16" />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password" :rules="[{ required: true, message: '请输入密码', whitespace: true }]">
                        <a-input-password ref="RefSpeechPassword" v-model:value.trim="Store.state.userinfo.password" size="large" placeholder="密码" @pressEnter="login">
                            <template #prefix>
                                <img src="@/assets/login/psw.png" width="16" />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item name="urlIp" :rules="[{ required: true, message: '请输入选择厂区' }]">
                        <img class="fac" src="@/assets/login/fac.png" width="16" />
                        <a-select
                            ref="RefSpeechFactory"
                            v-model:value="Store.state.userinfo.urlIp"
                            :open="open"
                            size="large"
                            placeholder="厂区"
                            :options="makeEnum(Store.state.env.render, 'shortFacName', 'urlIp')"
                        />
                    </a-form-item>
                    <div class="flex flex_sb mb8">
                        <a-checkbox v-model:checked="Store.state.userinfo.remember">记住密码</a-checkbox>
                        <a-button type="link" @click="Router.replace('/忘记密码')">忘记密码</a-button>
                    </div>
                    <a-button class="w100" type="primary" @click="login">登录</a-button>
                </a-form>
                <br />
                <a-button class="w100" type="primary" size="large" danger @click="DllPrint">打印测试</a-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.index {
    position: relative;
    > img {
        top: 0;
        left: 0;
        z-index: -1;
        width: 101%;
        height: 100%;
        display: block;
        object-fit: cover;
        position: absolute;
    }
    .content {
        width: 1111px;
        height: 567px;
        overflow: hidden;
        border-radius: 8px;
        background: #ffffff;
        box-shadow:
            0 6px 16px -8px rgba(0, 0, 0, 0.08),
            0 9px 28px 0 rgba(0, 0, 0, 0.05),
            0 12px 48px 16px rgba(0, 0, 0, 0.03);
        .left {
            width: 555px;
            > img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
            }
        }
        .right {
            > .logo {
                margin: 64px 0 8px 0;
            }
            > .title {
                font-size: 20px;
                color: #1f9fff;
                font-weight: 600;
                margin-bottom: 62px;
                letter-spacing: 1px;
                :deep(.ant-select-selector) {
                    .ant-select-selection-item {
                        font-size: 28px;
                        color: #1f9fff;
                        font-weight: bolder;
                    }
                }
            }
            .fac {
                top: 50%;
                z-index: 1;
                left: 11px;
                position: absolute;
                transform: translateY(-50%);
            }
            :deep(input) {
                margin-left: 4px;
            }
            :deep(.ant-form .ant-select-selector) {
                padding-left: 34px;
            }
        }
    }
}
</style>
