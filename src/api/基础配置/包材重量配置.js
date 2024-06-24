import api from '@/api'

export const apiAdd = (data) => api.post('/my-slaughter-edge-deliverGoods/packingMaterialInfo/add', data, { loading: true, message: 'all' })

export const apiEdit = (data) => api.post('/my-slaughter-edge-deliverGoods/packingMaterialInfo/edit', data, { loading: true, message: 'all' })

export const apiDel = (id) => api.get(`/my-slaughter-edge-deliverGoods/packingMaterialInfo/del?id=${id}`, { loading: true, message: 'all' })

export const apiGetPageList = (data) => api.post('/my-slaughter-edge-deliverGoods/packingMaterialInfo/getPageList', data, { loading: true, message: 'error' })

export const apiGetProductTree = () => api.get('/my-slaughter-edge-deliverGoods/packingMaterialInfo/getProductTree', { loading: true, message: 'error' })

export const apiGetRelatedProductTree = (id) => api.get(`/my-slaughter-edge-deliverGoods/packingMaterialInfo/getRelatedProduct?id=${id}`, { loading: true, message: 'error' })

export const apiGetNoRelatedProductTree = () => api.get('/my-slaughter-edge-deliverGoods/packingMaterialInfo/getNoRelatedProduct', { loading: true, message: 'error' })

export const apiGetNoRelatedProductCount = () => api.get('/my-slaughter-edge-deliverGoods/packingMaterialInfo/getNoRelatedProductCount', { loading: true, message: 'error' })

export const apiExport = (data) => api.post('/my-slaughter-workshop-wms-data-service/packingMaterialInfo/exportExcel', data, { loading: true, message: 'all' })

export const apiGetProductById = (id) => api.get(`/my-slaughter-edge-deliverGoods/packingMaterialInfo/getProductById?id=${id}`, { loading: true, message: 'error' })
