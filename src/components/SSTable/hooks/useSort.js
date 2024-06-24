export default (PROPS, EMITS) => ({
    onchange: (sorter) => {
        if (PROPS.sort) {
            const column = PROPS.columns.find((e) => e.dataIndex === sorter.field)
            const value = {
                ascend: column?.ascendValue ?? 'ascend',
                descend: column?.descendValue ?? 'descend'
            }
            EMITS('update:sort', { ...PROPS.sort, [column?.sortField || `${sorter.field}Sort`]: value[`${sorter.order}`] ?? sorter.order })
        }
    }
})
