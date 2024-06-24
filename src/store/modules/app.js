import Store from '@/store'
import { nextTick } from 'vue'
import { version, build } from '@/../package.json'
import LocalStorage from '@/utils/LocalStorage'
import { message, notification } from 'ant-design-vue'

const app = {
    namespaced: true,
    state: {
        // name,
        id: '',
        version,
        zoom: 1,
        isPackaged: true,
        loading: new Map(),
        dev: import.meta.env.DEV,
        electron: !!window.require,
        appName: build.productName,
        name: 'my_slaughter_workshop_management',
        feedback: 'https://www.jiandaoyun.com/app/63170ed4b8d19400097bc05f/entry/63228695db3fc00008a01635'
    },
    mutations: {
        IS_PACKAGED(state, isPackaged) {
            state.isPackaged = isPackaged
        },
        PAGE_ANIMATION_END() {},
        ZOOM_APP(state, { zoom, byHand }) {
            zoom = +zoom.toFixed(2)
            if (zoom >= -3 && zoom <= 3) {
                LocalStorage.setItem('zoom', zoom)
                require('electron').webFrame.setZoomLevel(zoom)
                setTimeout(() => {
                    byHand &&
                        notification.open({
                            key: 'zoom',
                            message: '应用缩放',
                            description: `缩放等级：${zoom} 页面尺寸：${document.body.offsetWidth} x ${document.body.offsetHeight}`
                        })
                    state.zoom = zoom
                })
            } else {
                message.warn('缩放级别过大')
            }
        }
    },
    actions: {
        getIsPackaged({ commit }) {
            return new Promise((resolve) => {
                const code = Date.now()
                require('electron').ipcRenderer.once(code, (_, isPackaged) => {
                    commit('IS_PACKAGED', isPackaged)
                    resolve(isPackaged)
                })
                require('electron').ipcRenderer.invoke('EVAL', `window.webContents.send('${code}', app.isPackaged)`)
            })
        }
    }
}

window.addEventListener(
    'load',
    () =>
        setTimeout(async () => {
            Store.commit('app/ZOOM_APP', { zoom: +LocalStorage.getItem('zoom') || 0 })
            while (true) {
                if (document.body.offsetWidth >= 1680) {
                    break
                } else {
                    Store.commit('app/ZOOM_APP', { zoom: Store.state.app.zoom - 0.1 })
                }
                await new Promise((resolve) => setTimeout(resolve))
            }
        }),
    { once: true }
)

nextTick(() => Store.dispatch('app/getIsPackaged'))

try {
    console.log(
        '本机 MAC 地址',
        Array.from(
            new Set(
                Object.values(require('os').networkInterfaces())
                    .flat()
                    .map((e) => e.mac)
            )
        ).join(' / ')
    )
    nextTick(() => {
        let name = ''
        const ips = Object.values(require('os').networkInterfaces())
            .flat()
            .filter((e) => e.family === 'IPv4')
            .map((e) => e.address)
            .filter((e) => e !== '127.0.0.1' && e !== '0.0.1.1')
        ips.forEach((e) => {
            const arr = e.split('.')
            Store.state.env.render
                .map((e) => (e.urlIp.replace('http://', '') + '.' + e.shortFacName).split('.'))
                .forEach((e) => {
                    if (e[0] === arr[0] && e[1] === arr[1]) {
                        name = `${e.at(-1)}`
                    }
                })
        })
        if (name) {
            console.log(`当前IP为 ${ips.join(' / ')} 可能所在厂区：${name}`)
        } else {
            console.log(`当前IP为 ${ips.join(' / ')} 不在厂区`)
        }
    })
} catch (error) {
    console.log('👀  error:', error)
}

export default app
