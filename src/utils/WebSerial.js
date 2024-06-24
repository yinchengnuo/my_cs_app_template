import Store from '@/store'
import LocalStorage from './LocalStorage'
import { message, notification } from 'ant-design-vue'

export const SerialMap = {}

const WebSerial = {
    open(config, options) {
        return new Promise(async (resolve, reject) => {
            if (!Store.state.serial.all.length) {
                !options.silent && message.error('请连接串口设备')
                return reject(new Error('请连接串口设备'))
            }
            if (!config) {
                !options.silent && message.error('无法读取串口配置信息')
                return reject(new Error('无法读取串口配置信息'))
            }
            const name = `${config.belongsPages}_${config.deviceName}`
            const serialOptions = {
                baudRate: +config.remark || 9600
            }
            const read = async () => {
                try {
                    while (SerialMap[name]) {
                        const { value, done } = (await SerialMap[name].reader?.read()) || {}
                        if (done) {
                            break
                        }
                        options.onread && options.onread(value)
                    }
                } catch (error) {
                    if (SerialMap[name]) {
                        SerialMap[name]?.reader?.releaseLock()
                        SerialMap[name]?.instance
                            ?.close()
                            .catch(() => {})
                            .finally(() => {
                                SerialMap[name]?.instance?.open(serialOptions).then(() => {
                                    SerialMap[name].reader = SerialMap[name].instance?.readable.getReader()
                                    options.onread && read()
                                })
                            })
                    }
                }
            }
            const open = async () => {
                await require('electron').ipcRenderer.invoke('SELECT_SERIAL_PORT', config.serialPort)
                navigator.serial
                    .requestPort()
                    .then((instance) => {
                        instance
                            .open(serialOptions)
                            .then(async () => {
                                const object = {
                                    name,
                                    instance,
                                    reader: instance.readable.getReader(),
                                    close() {
                                        return new Promise((resolve) => {
                                            if (SerialMap[this.name]) {
                                                this.reader
                                                    .cancel()
                                                    .catch(() => {})
                                                    .finally(() => {
                                                        this.reader.releaseLock()
                                                        this.instance
                                                            ?.close()
                                                            .catch(() => {})
                                                            .finally(() => {
                                                                resolve(1)
                                                                delete SerialMap[this.name]
                                                                !options.silent && notification.success({ message: '串口关闭成功', description: `串口已关闭：${name}` })
                                                            })
                                                    })
                                            }
                                            resolve(1)
                                        })
                                    },
                                    ...config
                                }
                                SerialMap[name] = object
                                LocalStorage.setItem(config.serialPort, object)
                                resolve(object)
                                !options.silent && notification.success({ message: '串口打开成功', description: `串口已打开：${name}` })
                                options.onread && read()
                            })
                            .catch((error) => {
                                !options.silent && notification.error({ message: '串口打开失败', description: `串口打开失败：${error.message}` })
                                reject(new Error(error.message))
                            })
                    })
                    .catch((error) => {
                        !options.silent && notification.error({ message: '串口打开失败', description: `当前设备不存在串口【${config.serialPort}】` })
                        reject(new Error(error.message))
                    })
            }
            open()
        })
    }
}

export default WebSerial
