import api from '@/api'

export const apiAddList = (data) => api.post('/my-slaughter-edge-deliverGoods/userConfig/addList', data, { loading: true, message: 'all' })

export const apiGetList = (data) => api.post('/my-slaughter-edge-deliverGoods/userConfig/getList', data, { loading: true, message: 'error' })
