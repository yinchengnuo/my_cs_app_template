import { reactive } from 'vue'

const fs = !!window.require && window.require('fs')
const path = !!window.require && window.require('path')
const raw = reactive({})
const DATAPATH = !!window.require && path.join(process.resourcesPath, './LocalStorage.json')
try {
    const data = JSON.parse(fs.readFileSync(DATAPATH).toString())
    localStorage.clear()
    for (const key in data) {
        raw[key] = data[key]
        if (typeof data[key] === 'object') {
            localStorage.setItem(key, JSON.stringify(data[key]))
        } else {
            localStorage.setItem(key, data[key])
        }
    }
} catch (error) {
    !!window.require && fs.writeFileSync(DATAPATH, '{}')
}

export default {
    raw,
    getItem (key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '')
        } catch (error) {
            return localStorage.getItem(key)
        }
    },
    setItem (key, value) {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value))
            raw[key] = JSON.parse(JSON.stringify(value))
        } else {
            localStorage.setItem(key, `${value}`)
            raw[key] = value
        }
        !!window.require && fs.writeFileSync(DATAPATH, JSON.stringify(raw, null, 4))
    },
    removeItem (key) {
        delete raw[key]
        localStorage.removeItem(key)
        !!window.require && fs.writeFileSync(DATAPATH, JSON.stringify(raw, null, 4))
    },
    clear () {
        localStorage.clear()
        for (const key in raw) {
            if (key !== 'login' && key !== 'zoom') {
                delete raw[key]
            }
        }
        !!window.require && fs.writeFileSync(DATAPATH, JSON.stringify(raw, null, 4))
    }
}
