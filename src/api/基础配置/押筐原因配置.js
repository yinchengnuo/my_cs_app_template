import api from '@/api'

export const apiGetReasonsTree = (data) => api.post('/my-slaughter-workshop-wms/myBasketCauseCategory/queryParentAll', data, { loading: true, message: 'error' })

export const apiEditAndAddReasons = (data) => api.post('/my-slaughter-workshop-wms/myBasketCauseCategory/addCategory', data, { loading: true, message: 'all' })

export const apiDelReasons = (data) => api.post('/my-slaughter-workshop-wms/myBasketCauseCategory/deleteById', data, { loading: true, message: 'all' })
