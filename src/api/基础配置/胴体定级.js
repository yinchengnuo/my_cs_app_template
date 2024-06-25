import api from '@/api'

export const exportLevelUrl = '/my-slaughter-workshop-product-carcass-line/gradeInfo/exportGradingStandardLists'

export const apiGetLevelList = (data) => api.post('/my-slaughter-workshop-product-carcass-line/gradeInfo/queryGradingStandardLists', data, { loading: true })

export const apiAddLevel = (data) => api.post('/my-slaughter-workshop-product-carcass-line/gradeInfo/addGradingStandard', data, { loading: true })

export const apiEditLevel = (data) => api.post('/my-slaughter-workshop-product-carcass-line/gradeInfo/updateGradingWeight', data, { loading: true })

export const apiGetEditLevelById = (data) => api.post('/my-slaughter-workshop-product-carcass-line/gradeInfo/queryGradingWeightDetail', data, { loading: true })

export const apiDeleteLevelById = (data) => api.post('/my-slaughter-workshop-product-carcass-line/gradeInfo/deleteByIds', data, { loading: true })
