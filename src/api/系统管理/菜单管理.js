import api from '@/api'

export const apiGetMenuList = (data) => api.post('/my-slaughter-workshop-user/menu/listByPage', data, { loading: true, message: 'error' })

export const apiSubmitMenu = (data) => api.post('/my-slaughter-workshop-user/menu/submit', data, { loading: true, message: 'error' })

export const apiUpdateMenu = (data) => api.post('/my-slaughter-workshop-user/menu/update', data, { loading: true, message: 'error' })

export const apiSaveMenu = (data) => api.post('/my-slaughter-workshop-user/menu/save', data, { loading: true, message: 'error' })

export const apiDelMenu = (data) => api.post('/my-slaughter-workshop-user/menu/del', data, { loading: true, message: 'error' })

export const apiGetCodesByRole = (data) => api.post('/my-slaughter-workshop-user/menu/getMenusByRole', data, { loading: true, message: 'error' })
