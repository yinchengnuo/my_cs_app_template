import { Modal } from 'ant-design-vue'

export function uuid() {
    const tempUrl = URL.createObjectURL(new Blob())
    const uuid = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return uuid.slice(-36)
}
export function replaceNull(string, payloads, split) {
    payloads.forEach((payload) => {
        string = string.replace(payload, '')
    })
    return typeof split === 'string' ? string.split(split) : string
}
export function makeEnum(arr, label, value, key) {
    arr = JSON.parse(JSON.stringify(arr))
    const map = (arr) => {
        arr.forEach((item) => {
            item.label = item[label || 'label']
            item.value = item[value || 'value']
            item.key = item[key || value || 'value']
            item.children && item.children.length && map(item.children)
        })
    }
    map(arr)
    return new Proxy(arr, {
        get(target, key) {
            if (key === 'label') {
                return (value) => arr.find((e) => e.value === value)?.label
            }
            if (key === 'value') {
                return (label) => arr.find((e) => e.label === label)?.value
            }
            return target[key]
        }
    })
}
export function thousandthDot(text) {
    if ((typeof text === 'string' && text.trim() === '') || text === null || text === undefined) {
        return ''
    }
    return isNaN(Number(text.toString())) ? text : Number(text).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
export function getPathByIdInTree(arr, id) {
    const result = []
    const find = (arr, path, deep) => {
        for (let i = 0; i < arr.length; i++) {
            path[deep] = i
            path.length = deep + 1
            if (arr[i].id === id) {
                Object.assign(result, path)
                break
            } else {
                if (arr[i].children) {
                    path.push('children')
                    find(arr[i].children, path, deep + 2)
                }
            }
        }
    }
    find(arr, [], 0)
    return result
}
export function getObjectByKeyInTree(arr, key, value) {
    let result = null
    const find = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][value ? key : 'id'] === (value || key) && result === null) {
                result = arr[i]
            } else {
                if (arr[i].children && arr[i].children?.length) {
                    find(arr[i].children)
                }
            }
        }
    }
    find(arr)
    return result
}

export let confirming = 0
export const modalConfirmList = []
export const modalConfirmSure = (val) => {
    if (modalConfirmList.length) {
        const item = modalConfirmList.pop()
        item.resolve(val)
        item.modal.destroy()
    }
}
export function modalConfirm(content, config) {
    return new Promise((resolve) => {
        confirming++
        modalConfirmList.push({
            resolve,
            modal: Modal.confirm({
                content,
                title: '提示',
                zIndex: 999999,
                closable: true,
                centered: true,
                maskClosable: true,
                ...config,
                onOk: () => {
                    confirming--
                    modalConfirmList.pop()?.resolve(true)
                },
                onCancel: () => {
                    confirming--
                    modalConfirmList.pop()?.resolve(false)
                }
            })
        })
    })
}

export const getQueryByName = (url, name) => {
    const reg = new RegExp('[?&]' + name + '=([^&#]+)')
    const query = url.match(reg)
    return query ? query[1].trim() : ''
}
export function isAllEqual(array) {
    if (array.length > 0) {
        return !array.some(function (item) {
            return item !== array[0]
        })
    } else {
        return true
    }
}
// eslint-disable-next-line max-len
export const uploadFileTypes =
    '.png, .jpg, .jpeg, .bmp, .gif, .svg, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .html, .txt, .md, .csv, .mp3, .wav, .wma, .midi, .flac, .mp4, .avi, .mkv, .nov, .flv, .wmv, .rmvb, .3gp'
