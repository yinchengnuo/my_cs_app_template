import Store from '@/store'
import { message } from 'ant-design-vue'

if (process.platform === 'win32') {
    require('electron').ipcRenderer.invoke('EVAL', `import('electron-edge-js').then(EDGE => (global.EDGE = EDGE,''))`)
}

export default () => {
    // require('electron').ipcRenderer.invoke('EVAL', `console.log(1, EDGE)`)
    if (process.platform === 'win32') {
        const assemblyFile = require('path').resolve(Store.state.app.isPackage ? './resources/app/dist/tsclibnet.dll' : './dist/tsclibnet.dll')
        // if () {}
        // console.log(require)mes
        message.info(assemblyFile)
    } else {
        message.warn('非 Windows 电脑不支持打印')
    }
}
