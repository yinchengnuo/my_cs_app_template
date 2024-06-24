import api from '@/api'

export const apiGet = () => api.get('/my-slaughter-edge-deliverGoods/pigCarrierConfig/getConfig', { loading: true, message: 'error' })

export const apiUpd = (data) => api.post('/my-slaughter-edge-deliverGoods/pigCarrierConfig/edit', data, { loading: true, message: 'error' })
