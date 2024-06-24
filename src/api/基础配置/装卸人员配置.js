import api from '@/api'

export const apiAddList = (data) => api.post('/my-slaughter-edge-deliverGoods/deliveryConfigData/add', data, { loading: true, message: 'all' })

export const apiGetPageList = (data) => api.post('/my-slaughter-edge-deliverGoods/deliveryConfigData/getCategoryTree', data, { loading: true, message: 'error' })

export const apiEdit = (data) => api.post('/my-slaughter-edge-deliverGoods/deliveryConfigData/edit', data, { loading: true, message: 'all' })

export const apiDel = (id) => api.get(`/my-slaughter-edge-deliverGoods/deliveryConfigData/del?id=${id}`, { loading: true, message: 'all' })

export const apiGetFirstLevelData = (data) => api.post('/my-slaughter-edge-deliverGoods/deliveryConfigData/getFirstLevelData', data, { loading: false, message: 'error' })

export const apiGetDataByParentCode = (data) => api.post('/my-slaughter-edge-deliverGoods/deliveryConfigData/getDataByParentCode', data, { loading: false, message: 'error' })
