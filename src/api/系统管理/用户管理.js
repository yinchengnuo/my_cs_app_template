import api from '@/api'

export const apiGetUserList = (data) => api.post('/my-slaughter-workshop-user/user/listUserByPage', data, { loading: true, message: 'error' })

export const apiAddUser = (data) => api.post('/my-slaughter-workshop-user/user/add', data, { loading: true, message: 'all' })

export const apiUpdataUser = (data) => api.post('/my-slaughter-workshop-user/user/update', data, { loading: true, message: 'all' })

export const apiDelUser = (data) => api.post('/my-slaughter-workshop-user/user/del', data, { loading: true, message: 'all' })

export const apiRestPassword = (code) => api.get(`/my-slaughter-workshop-user/user/resetPassword?code=${code}`, { loading: true, message: 'all' })

export const apiEnableUser = (code) => api.get(`/my-slaughter-workshop-user/user/enable?code=${code}`, { loading: true, message: 'all' })

export const apiDisableUser = (code) => api.get(`/my-slaughter-workshop-user/user/disable?code=${code}`, { loading: true, message: 'all' })
