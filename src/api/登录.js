/*
 * @Author: 尹成诺
 * @Date: 2022-12-02 08:59:48
 * @LastEditors: 文建立
 * @LastEditTime: 2023-09-06 12:15:11
 * @Description: file content
 */
import api from '@/api'

export const apiGetToken = (data) => api.post('/my-slaughter-workshop-user/auth/login', data, { loading: true, message: 'error' })

export const apiGetUserInfo = (data) => api.post('/my-slaughter-workshop-user/role/selectUserInfo', data, { loading: true, message: 'error' })

export const apiChangePsw = (data) => api.post('/my-slaughter-workshop-user/user/updatePassword', data, { loading: true, message: 'all' })

export const apiLayout = () => api.get('/my-slaughter-workshop-user/auth/logout', { loading: true, message: 'error' })

export const apiGetMenu = (data) => api.post('/my-slaughter-workshop-product-user/login/routes', data, { loading: true, message: 'error' })

export const apiGetButton = (data) => api.post('/my-slaughter-workshop-product-user/menu/buttons', data, { loading: true, message: 'error' })

export const getCode = (data) => api.post('/my-slaughter-workshop-user/user/generateAuthCcode', data, { loading: true, message: 'error' })

export const resetPass = (data) => api.post('/my-slaughter-workshop-user/user/updatePasswordOfConvertApi', data, { loading: true, message: 'error' })

export const getAccountList = (data) => api.post('/my-slaughter-workshop-user/user/checkUserInfo', data, { loading: true, message: 'error' })
