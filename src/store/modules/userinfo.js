import Store from '@/store'
import Router from '@/router'
import Encrypt from '@/utils/Encrypt'
import { message } from 'ant-design-vue'
import LocalStorage from '@/utils/LocalStorage'
import { apiGetUserInfo, apiGetToken } from '@/api/登录'

const _state = {
    all: null,
    roles: [],
    account: '',
    facCode: '',
    facName: '',
    password: '',
    remember: true,
    level: undefined,
    urlIp: undefined,
    shortFacName: '',
    newPeopleMode: false
}

Object.assign(_state, { ...(LocalStorage.getItem('login') || {}), all: null })

const userinfo = {
    namespaced: true,
    state: JSON.parse(JSON.stringify(_state)),
    mutations: {
        GOT_USERINFO(state, payload) {
            Object.assign(state, payload)
            LocalStorage.setItem('login', state)
        },
        SET_TOKEN(state, payload) {
            Object.assign(state, { token: payload })
            LocalStorage.setItem('token', state.token)
        },
        CLEAR(state) {
            Object.assign(state, _state, { urlIp: state.urlIp })
            LocalStorage.removeItem('login')
            Router.replace('/登录')
        }
    },
    actions: {
        getToken({ commit, state }) {
            return new Promise((resolve, reject) => {
                apiGetToken({
                    factoryCode: Store.state.env.render.find((e) => e.urlIp === state.urlIp).facCode,
                    account: state.account,
                    password: Encrypt.en(state.password),
                    secretKey: Store.state.app.name
                })
                    .then((res) => {
                        const strong = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*? ])(.{8,20})$/
                        const middle = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(.{8,20})$/
                        if (res.token) {
                            if ((!middle.test(state.password) && !strong.test(state.password)) || state.password.includes('002714')) {
                                message.loading('密码强度过低，请修改密码后重新登录！', 1.8)
                                setTimeout(() => {
                                    Router.replace('/忘记密码')
                                }, 1600)
                                reject(new Error('密码强度过低'))
                            } else {
                                commit('SET_TOKEN', res.token)
                                resolve(res)
                            }
                        }
                    })
                    .catch(reject)
            })
        },
        getUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                apiGetUserInfo({ menuType: 0, projectCode: Store.state.app.name })
                    .then((res) => {
                        const factory = Store.state.env.render.find((e) => e.urlIp === state.urlIp)
                        if (res.user.code) {
                            commit('GOT_USERINFO', { ...factory, all: res.user, roles: res.roles.map((item) => item.name) })
                            resolve(res.user)
                        } else {
                            reject('角色不存在，请联系运维')
                        }
                    })
                    .catch(reject)
            })
        }
    }
}

export default userinfo
