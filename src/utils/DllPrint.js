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
        require('electron').ipcRenderer.invoke(
            'EVAL',
            `
            let openport = edge.func({ assemblyFile, typeName, methodName: 'openport' })
            let sendcommand = edge.func({ assemblyFile, typeName, methodName: 'sendcommand' })
            let clearbuffer = edge.func({ assemblyFile, typeName, methodName: 'clearbuffer' })
            let printlabel = edge.func({ assemblyFile, typeName, methodName: 'printlabel' })
            let closeport = edge.func({ assemblyFile, typeName, methodName: 'closeport' })
            let windowsfont = edge.func({ assemblyFile, typeName, methodName: 'windowsfont' })
            let setup = edge.func({ assemblyFile, typeName, methodName: 'setup' })

            openport('USB')
            setup({ width: '80', height: '45.61', speed: '4.9', density: '8', sensor: '1', vertical: '4', offset: '0' })

            sendcommand('DIRECTION 1')
            clearbuffer('', true)
            windowsfont({ x: 90, y: 160, fontheight: 58, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: '黑体', content: '鲜猪一级带皮白条' }, true)
            windowsfont({ x: 90, y: 190 + 60 * 1, fontheight: 35, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: '黑体', content: '生产日期：见检疫章日期' }, true)
            windowsfont({ x: 90, y: 190 + 60 * 2, fontheight: 35, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: '黑体', content: '批 次 号：012' }, true)
            windowsfont({ x: 90, y: 190 + 60 * 3, fontheight: 35, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: '黑体', content: '执行标准：GB 2707' }, true)
            windowsfont({ x: 90, y: 190 + 60 * 4, fontheight: 35, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: '黑体', content: '装车顺序：0001' }, true)
            sendcommand('QRCODE 620,190,L,10,A,0,M2,S7,X230,"' + 'test' + '"', true)
            windowsfont({ x: 579, y: 345, fontheight: 78, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: '黑体', content: '89.1kg' }, true);
            printlabel({ quantity: '1', copy: '1' }, true)
            closeport('', true)
          `
        )
    } else {
        message.warn('非 Windows 电脑不支持打印')
    }
}
