import envs from './env.js'
import electronUpdater from 'electron-updater'
import { app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut, powerSaveBlocker } from 'electron'

let updater
const ENV = 'local'
Menu.setApplicationMenu(null)
const { autoUpdater } = electronUpdater
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const URL = envs.find((e) => e.tag === ENV).url
app.commandLine.appendSwitch('disable-web-security')
app.commandLine.appendSwitch('ignore-certificate-errors')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = undefined
const name = envs.find((e) => e.tag === ENV).name + app.isPackaged ? 'appName' : ''
app.setName(name)
const gotTheLock = app.isPackaged ? app.requestSingleInstanceLock({}) : true
if (gotTheLock) {
    app.whenReady().then(() => {
        powerSaveBlocker.start('prevent-display-sleep')
        const window = new BrowserWindow({
            show: false,
            frame: false,
            webPreferences: { webviewTag: true, nodeIntegration: true, contextIsolation: false, allowRunningInsecureContent: true }
        })
        if (process.platform === 'win32') window.maximize()
        if (process.platform === 'darwin') window.setFullScreen(true)
        window.webContents.session.setPermissionCheckHandler(() => true)
        window.webContents.session.setDevicePermissionHandler(() => true)
        window.webContents.session.setPermissionRequestHandler((_, __, callback) => callback(true))
        app.on('second-instance', () => {
            if (window) window.focus()
            if (window && window.isMinimized()) window.restore()
        })
        if (app.isPackaged) {
            window.loadURL(URL)
            autoUpdater.checkForUpdatesAndNotify()
            autoUpdater.on('error', (error) => dialog.showMessageBox({ type: 'warning', title: name, message: `检查更新出错：${error.message}` }))
            autoUpdater.on('update-available', ({ version }) => {
                updater = new BrowserWindow({ frame: false, transparent: true, webPreferences: { nodeIntegration: true, contextIsolation: false } })
                updater.loadURL(`${URL}/updater.html?version=${version}`)
                updater.webContents.once('did-finish-load', () => {
                    window.close()
                    updater.focus()
                })
            })
            autoUpdater.on('download-progress', ({ total, transferred }) => updater?.webContents?.send('download-progress', { total, transferred }))
            autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall())
        } else {
            window.loadURL(URL)
        }
        ipcMain.handle('EVAL', (_, code) => eval(code))
        window.webContents.once('did-finish-load', () => window.show())
        window.webContents.once('did-fail-load', () => {
            dialog.showMessageBox({ type: 'warning', title: name, message: '无法加载页面' })
            app.quit()
        })
        let selectedPortName = ''
        ipcMain.handle('SELECT_SERIAL_PORT', (_, payload) => {
            selectedPortName = payload
        })
        window.webContents.session.on('select-serial-port', function (_, portList, webContents, select) {
            webContents.send('GET_SERIAL_LIST', portList)
            if (selectedPortName) {
                select(portList.find((e) => e.portName === selectedPortName)?.portId || '')
                selectedPortName = ''
            } else {
                select('')
            }
        })
        window.on('blur', () => globalShortcut.unregisterAll())
        window.on('focus', () => globalShortcut.register('CommandOrControl+R', () => window.webContents.reload()))
    })
    app.on('will-quit', () => globalShortcut.unregisterAll())
    app.on('window-all-closed', () => app.quit())
} else {
    app.quit()
}
