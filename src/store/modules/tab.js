import Store from '@/store'
import Router from '@/router'
import { nextTick } from 'vue'

let _RefreshIndex = -1

const state = []

try {
    JSON.parse(sessionStorage.getItem('tab') || '[]').forEach((path, index) => {
        state[index] = path
    })
} catch (e) {
    state.length = 0
    Router.replace('/登录')
}

const tab = {
    namespaced: true,
    state,
    mutations: {
        ADD_TAB(state, { path }) {
            if (!state.includes(path) && path !== '/刷新') {
                _RefreshIndex >= 0 ? state.splice(_RefreshIndex, 0, path) : state.push(path)
                _RefreshIndex = -1
            }
        },
        REFRESH(state, { path }) {
            _RefreshIndex = state.indexOf(path)
            Store.commit('tab/DEL_TAB', { path })
        },
        DEL_TAB(state, { path }) {
            let nextPath = ''
            const index = state.indexOf(path)
            if (_RefreshIndex === -1) {
                if (Router.currentRoute.value.path === path) {
                    if (state[index + 1]) {
                        nextPath = state[index + 1]
                    }
                    if (!state[index + 1] && index - 1 >= 0) {
                        nextPath = state[index - 1]
                    }
                }
            } else {
                nextPath = `/刷新?path=${path}`
            }
            if (nextPath) {
                Router.replace(nextPath)
                const subscribe = Store.subscribe((mutation) => {
                    if (mutation.type === 'app/PAGE_ANIMATION_END') {
                        subscribe()
                        state.splice(index, 1)
                        !state.length && Router.replace('/首页')
                    }
                })
            } else {
                state.splice(index, 1)
                if (!state.length) {
                    Router.currentRoute.value.path === '/首页' ? state.push('/首页') : Router.replace('/首页')
                }
            }
        },
        DEL_ALL(state) {
            state[0] = '/首页'
            if (Router.currentRoute.value.path === '/首页') {
                state.length = 1
            } else {
                Router.replace('/首页')
                const subscribe = Store.subscribe((mutation) => {
                    if (mutation.type === 'app/PAGE_ANIMATION_END') {
                        subscribe()
                        state.length = 1
                    }
                })
            }
        },
        DEL_OTHER(state) {
            state[0] = state[state.findIndex((e) => e === Router.currentRoute.value.path)]
            state.length = 1
        }
    }
}

nextTick(() =>
    Store.watch(
        () => Store.state.tab,
        () => sessionStorage.setItem('tab', JSON.stringify(Store.state.tab)),
        { deep: true }
    )
)

export default tab
