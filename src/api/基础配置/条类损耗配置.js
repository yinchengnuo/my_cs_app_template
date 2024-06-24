import api from '@/api'

export const apiGet = (notLoading) => api.get('/my-slaughter-edge-deliverGoods/pigLossConfig/getConfig', { loading: !notLoading, message: 'error' })

export const apiGetLossRate = (data, notLoading) => api.post('/my-slaughter-edge-deliverGoods/common/getBaseLossRate', data, { loading: !notLoading, message: 'error' })

export const apiUpd = (data) => api.post('/my-slaughter-edge-deliverGoods/pigLossConfig/edit', data, { loading: true, message: 'error' })

export const apiGetPigCoreTemperatureRange = (notLoading) => api.get('/my-slaughter-edge-deliverGoods/pigWeighing/getPigCoreTemperatureRange ', { loading: !notLoading, message: 'error' })
