import Store from '@/store'
import LocalStorage from '@/utils/LocalStorage'

const env_ = [
    { level: 1, facCode: '103', facName: '内乡肉食', shortFacName: '内乡', urlIp: 'http://10.10.60.35:8002' },
    { level: 1, facCode: '104', facName: '正阳肉食', shortFacName: '正阳', urlIp: 'http://10.31.60.35:8002' },
    { level: 2, facCode: '205', facName: '颍上肉食', shortFacName: '颍上', urlIp: 'http://10.36.60.13:8002' },
    { level: 2, facCode: '118', facName: '商水肉食', shortFacName: '商水', urlIp: 'http://10.34.60.13:8002' },
    { level: 2, facCode: '176', facName: '曹县肉食', shortFacName: '曹县', urlIp: 'http://10.35.60.13:8002' },
    { level: 2, facCode: '163', facName: '铁岭肉食', shortFacName: '铁岭', urlIp: 'http://10.37.60.13:8002' },
    { level: 2, facCode: '178', facName: '宁陵肉食', shortFacName: '宁陵', urlIp: 'http://10.33.60.13:8002' },
    { level: 2, facCode: '174', facName: '奈曼肉食', shortFacName: '奈曼', urlIp: 'http://10.40.60.13:8002' },
    { level: 2, facCode: '179', facName: '林甸肉食', shortFacName: '林甸', urlIp: 'http://10.38.60.13:8002' },
    { level: 2, facCode: '177', facName: '滑县肉食', shortFacName: '滑县', urlIp: 'http://10.32.60.13:8002' },
    { level: 2, facCode: '162', facName: '通榆肉食', shortFacName: '通榆', urlIp: 'http://10.39.60.13:8002' }
]

const envs = {
    env_,
    env_dev: [
        ...env_.map((e, i) => ({
            ...e,
            facName: `开发环境-${e.facName}`,
            shortFacName: `开发环境-${e.shortFacName}`,
            urlIp: Array(i).fill(' ').join('') + 'http://10.106.215.92:8002'
        }))
    ],
    env_test: [
        ...env_.map((e, i) => ({
            ...e,
            facName: `测试环境-${e.facName}`,
            shortFacName: `测试环境-${e.shortFacName}`,
            urlIp: Array(i).fill(' ').join('') + 'http://10.106.215.134:8002'
        }))
    ],
    env_oms: [
        ...env_.map((e, i) => ({
            ...e,
            facName: `OMS环境-${e.facName}`,
            shortFacName: `OMS环境-${e.shortFacName}`,
            urlIp: Array(i).fill(' ').join('') + 'http://10.106.215.141:8002'
        }))
    ],
    env_sap: [
        ...env_.map((e, i) => ({
            ...e,
            facName: `SAP环境-${e.facName}`,
            shortFacName: `SAP环境-${e.shortFacName}`,
            urlIp: Array(i).fill(' ').join('') + 'http://10.106.215.38:8002'
        }))
    ]
}

envs.env_local = envs.env_dev.concat(envs.env_test).concat(envs.env_oms).concat(envs.env_sap)

const state = LocalStorage.getItem('envs') || {
    env: {},
    main: [],
    render: []
}

const env = {
    state,
    namespaced: true,
    mutations: {
        GOT_MAIN_ENVS(state, payload) {
            state.main = payload
            const env = state.main.find((e) => e.url === location.origin + (location.pathname === '/' ? '' : location.pathname))
            state.env = env
            state.render = envs['env_' + env.tag]
            LocalStorage.setItem('envs', state)
        }
    }
}

const code = Date.now()
require('electron').ipcRenderer.once(code, (_, envs) => Store.commit('env/GOT_MAIN_ENVS', envs))
require('electron').ipcRenderer.invoke('EVAL', `window.webContents.send('${code}', envs)`)

export default env
