import api from '@/api'

export const apiGetRoleList = (data) => api.post('/my-slaughter-workshop-user/role/listByPage', data, { loading: true, message: 'error' })

export const apiGetAuthDetail = (params) => api.get('/my-slaughter-workshop-user/menu/role-tree-keys', { params, loading: true, message: 'all' })

export const apiGetAuthSet = (data) => api.post('/my-slaughter-workshop-user/role/assignPermissions', data, { loading: true, message: 'all' })

export const apiAddRole = (data) => api.post('/my-slaughter-workshop-user/role/save', data, { loading: true, message: 'all' })

export const apiUpdateRole = (data) => api.post('/my-slaughter-workshop-user/role/update', data, { loading: true, message: 'all' })

export const apiDelRole = (data) => api.post('/my-slaughter-workshop-user/role/del', data, { loading: true, message: 'all' })
