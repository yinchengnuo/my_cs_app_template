import api from '@/api'

export const apiGet = () => api.post('/my-slaughter-edge-deliverGoods/myDeliverSerialportConfig/listRecordByPage', {}, { message: 'error' })

export const apiUpd = (data) => api.post('/my-slaughter-edge-deliverGoods/myDeliverSerialportConfig/addRecord', data, { loading: true, message: 'error' })

export const del = (id) => api.get('/my-slaughter-edge-deliverGoods/myDeliverSerialportConfig/delRecord?id=' + id, { loading: true, message: 'error' })
