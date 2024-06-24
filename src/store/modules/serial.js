import Store from '@/store'
import { apiGet } from '@/api/基础配置/串口设备配置'

if (window.require) {
    window.addEventListener('load', () => {
        document.addEventListener('click', () => navigator.serial.requestPort().catch(() => {}), { capture: true })
        document.body.click()
    })

    require('electron').ipcRenderer.on('GET_SERIAL_LIST', (_, list) => {
        Store.commit('serial/GET_ALL_SERIAL_PORT', list)
    })
}

const serial = {
    namespaced: true,
    state: {
        all: [],
        configList: []
    },
    mutations: {
        GET_ALL_SERIAL_PORT(state, payload) {
            state.all = payload
        },
        GET_SERIAL_CONFIG_LIST(state, payload) {
            state.configList = payload
        }
    },
    actions: {
        async getSerialConfigList({ commit }) {
            commit('GET_SERIAL_CONFIG_LIST', await apiGet())
        }
    }
}

export default serial
