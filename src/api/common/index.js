import api from '@/api'
import dayjs from 'dayjs'
import { message, notification } from 'ant-design-vue'

const fs = !!window.require && window.require('fs')
const os = !!window.require && window.require('os')
const path = !!window.require && window.require('path')
const electron = !!window.require && window.require('electron')

let downloading = false

export const exportExcel = (url, fileName, data, config) => {
    return new Promise((resolve, reject) => {
        if (downloading) {
            message.warning('文件正在下载中，请稍后再试')
            reject(new Error('文件正在下载中，请稍后再试'))
        } else {
            downloading = true
            fileName = `${fileName}${dayjs(new Date()).format('YYYYMMDDHHmmss')}.xlsx`
            notification.open({
                key: 'download',
                message: '文件导出中...',
                description: `${fileName} 0KB(0MB)`
            })
            let _data
            api(url, {
                data,
                method: 'post',
                responseType: 'arraybuffer',
                onDownloadProgress: (e) => {
                    notification.open({
                        key: 'download',
                        message: '文件导出中...',
                        description: `${fileName} ${+(e.loaded / 1024).toFixed(2)}KB`
                    })
                },
                ...(config || {})
            })
                .then((data) => {
                    _data = data
                    notification.success({ key: 'download', message: '文件导出成功', description: `${fileName}` })
                    fs.writeFileSync(path.join(os.homedir(), 'Downloads', fileName), Buffer.from(data), 'binary')
                    electron.shell.showItemInFolder(path.join(os.homedir(), 'Downloads', fileName))
                    resolve(path.join(os.homedir(), 'Downloads', fileName))
                })
                .catch((e) => {
                    if (e.msg) return notification.error({ key: 'download', message: '文件导出失败', description: e.msg })
                    const a = document.createElement('a')
                    a.download = fileName
                    a.href = URL.createObjectURL(new Blob([_data]))
                    a.click()
                    a.remove()
                    resolve(1)
                })
                .finally(() => {
                    _data = null
                    downloading = false
                })
        }
    })
}

export const exportExcelByUrl = (url, filename) => {
    const link = document.createElement('a')
    link.target = '_blank'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
