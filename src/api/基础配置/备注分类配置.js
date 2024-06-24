import api from '@/api'

export const apiAddList = (data) => api.post('/my-slaughter-edge-deliverGoods/departureDelayCategory/add', data, { loading: true, message: 'all' })

export const apiGetCategoryTree = (data) => api.post('/my-slaughter-edge-deliverGoods/departureDelayCategory/getCategoryTree', data, { loading: true, message: 'error' })

export const apiEditCategory = (data) => api.post('/my-slaughter-edge-deliverGoods/departureDelayCategory/edit', data, { loading: true, message: 'all' })

export const apiDelCategory = (id) => api.get(`/my-slaughter-edge-deliverGoods/departureDelayCategory/del?id=${id}`, { loading: true, message: 'all' })

export const apiGetCategoryDetail = (id) => api.get(`/my-slaughter-edge-deliverGoods/departureDelayCategory/getDetail?id=${id}`, { loading: true, message: 'error' })
