/*
 * @Author: 尹成诺
 * @Date: 2022-08-18 16:59:51
 * @LastEditors: 文建立
 * @LastEditTime: 2023-04-14 09:45:46
 * @Description: file content
 */
import axios from 'axios'
import Store from '@/store'
import { message } from 'ant-design-vue'
import LocalStorage from '@/utils/LocalStorage'

const api = axios.create({
    timeout: 1000 * 60,
    validateStatus: () => true
})
export const otherApi = axios.create()

api.interceptors.request.use((config) => {
    if (!config.baseURL) {
        config.baseURL = Store.state.userinfo.urlIp
    }
    config.headers.jobNo = Store.state.userinfo.account
    config.headers.name = encodeURIComponent(Store.state.userinfo.all?.realName || '')
    if (config.loading) {
        Store.state.app.loading.set(config, config)
    }
    if (LocalStorage.getItem('token')) {
        config.headers.Authorization = LocalStorage.getItem('token')
    }
    return config
})

api.interceptors.response.use(
    (response) => {
        if (response.config.loading) {
            Store.state.app.loading.delete(response.config)
        }
        if (response.status === 200) {
            if (response.config.message) {
                if (response.data.success) {
                    if (response.config.message === 'all') {
                        message.success(response.data.msg || '操作成功', 2)
                    }
                    return response.data.data
                } else {
                    message.error(response.data.msg || '操作失败', 2)
                    return response.data
                }
            } else {
                return response.data
            }
        } else {
            const data = response.data.byteLength ? JSON.parse(new TextDecoder('utf-8').decode(new Uint8Array(response.data))) : response.data
            message.error(data?.msg || '网络异常', 2)
            return Promise.reject(data || { msg: '网络异常' })
        }
    },
    ({ config, message: msg }) => {
        message.error(msg || '网络异常', 2)
        if (config && config.loading) {
            Store.state.app.loading.delete(config)
        }
    }
)

export default api
