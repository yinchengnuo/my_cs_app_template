import api from '@/api'

export const apiAdd = (data) => api.post('/my-slaughter-edge-deliverGoods/dictData/add', data, { loading: true, message: 'all' })

export const apiEdit = (data) => api.post('/my-slaughter-edge-deliverGoods/dictData/edit', data, { loading: true, message: 'all' })

export const apiGetPageList = (data) => api.post('/my-slaughter-edge-deliverGoods/dictData/getPageList', data, { loading: true, message: 'error' })

export const apiDel = (id) => api.get(`/my-slaughter-edge-deliverGoods/dictData/del?id=${id}`, { loading: true, message: 'all' })

export const apiGetListByParentCode = (parentCode) => api.get(`/my-slaughter-edge-deliverGoods/dictData/getListByParentCode?parentCode=${parentCode}`, { loading: true, message: 'error' })

export const apiGetNoParentCode = () => api.get('/my-slaughter-edge-deliverGoods/dictData/getNoParentCodeList', { loading: true, message: 'error' })
