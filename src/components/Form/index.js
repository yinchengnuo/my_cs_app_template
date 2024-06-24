import Form from './Form.vue'
import { replaceNull } from '@/utils'

export const MyNumberValidator = (title, type) => {
    return (_, value) => {
        if (!Number.isNaN(+value) && value !== null && value !== undefined) {
            value = +value
            if (type === '>0') {
                if (value > 0) {
                    return Promise.resolve()
                } else {
                    return Promise.reject(new Error(title + '必须大于0'))
                }
            }
            if (type === '<0') {
                if (value < 0) {
                    return Promise.resolve()
                } else {
                    return Promise.reject(new Error(title + '必须小于0'))
                }
            }
            if (type === '=0') {
                if (value === 0) {
                    return Promise.resolve()
                } else {
                    return Promise.reject(new Error(title + '必须等于0'))
                }
            }
            if (type === '>=0') {
                if (value >= 0) {
                    return Promise.resolve()
                } else {
                    return Promise.reject(new Error(title + '必须大于等于0'))
                }
            }
            if (type === '<=0') {
                if (value <= 0) {
                    return Promise.resolve()
                } else {
                    return Promise.reject(new Error(title + '必须小于等于0'))
                }
            }
            if (type === '!=0') {
                if (value !== 0) {
                    return Promise.resolve()
                } else {
                    return Promise.reject(new Error(title + '不能为0'))
                }
            }
        } else {
            return Promise.reject(new Error('请输入' + title))
        }
    }
}

export default {
    install: (app) => {
        app.component('Form', Form)
        Object.entries(import.meta.glob('./components/*.vue', { eager: true })).forEach(([key, value]) => {
            app.component(replaceNull(key, ['./components/', '.vue']), value.default)
        })
    }
}
