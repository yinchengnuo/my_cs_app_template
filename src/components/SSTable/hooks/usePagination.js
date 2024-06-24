import { computed } from 'vue'

const pageSizeOptions = ['50', '100', '200', '500']

export default (PROPS, EMITS) => ({
    onchange: (pagination) => {
        const page = {
            [PROPS.total || 'total']: PROPS.page?.total,
            [PROPS.current || 'current']: pagination.current,
            [PROPS.pageSize || 'pageSize']: pagination.pageSize
        }
        if (PROPS.page && PROPS.page[PROPS.pageSize || 'pageSize'] !== pagination.pageSize) {
            page[PROPS.current || 'current'] = 1
        }
        EMITS('update:page', page)
    },
    pagination: computed(() => {
        if (PROPS?.pagination === false) return false
        if (!PROPS?.page && !PROPS?.pagination) return false
        const total = PROPS.page ? PROPS.page[PROPS.total || 'total'] : PROPS.dataSource.length
        const pagination = {
            total,
            pageSizeOptions,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: () => `${total}条数据`,
            defaultPageSize: PROPS.page ? PROPS.page[PROPS.pageSize || 'pageSize'] : +pageSizeOptions[0]
        }
        PROPS.page && Object.assign(pagination, PROPS.page)
        if (PROPS.page) {
            if (PROPS.total) {
                pagination.total = Number(PROPS.page[PROPS.total])
                delete pagination[PROPS.total]
            }
            if (PROPS.current) {
                pagination.current = Number(PROPS.page[PROPS.current])
                delete pagination[PROPS.current]
            }
            if (PROPS.pageSize) {
                pagination.pageSize = Number(PROPS.page[PROPS.pageSize])
                delete pagination[PROPS.pageSize]
            }
        }
        PROPS.pagination && Object.assign(pagination, PROPS.pagination)
        return pagination
    })
})
