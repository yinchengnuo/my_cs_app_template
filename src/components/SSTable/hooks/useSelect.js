import { computed, nextTick, ref, watch } from 'vue'

export default (props, emits, rowKey) => {
    let lock = false
    const selectedRowKeys = ref([])
    const vModel = computed(() => Boolean(props.select) || Boolean(props.selectRowKey))
    const set = (rowKeys, rows) => {
        lock = true
        nextTick(() => (lock = false))
        selectedRowKeys.value = rowKeys
        emits('update:select', rows)
        emits('update:selectRowKey', rowKeys)
    }
    const setSelected = () => {
        if (lock) return
        const select = props.select || []
        const selectRowKey = props.selectRowKey || []
        const rowKeys = [...new Set([...selectRowKey, ...select.map((e) => e[rowKey.value])])]
        set(
            rowKeys,
            props.dataSource.filter((e) => rowKeys.includes(e[rowKey.value]))
        )
    }
    if (vModel.value) {
        setSelected()
        props.select && watch(() => props.select, setSelected, { deep: true })
        props.selectRowKey && watch(() => props.selectRowKey, setSelected, { deep: true })
    }

    const select = computed(() => Boolean(props.select || props.rowSelection))
    return {
        select,
        clearSelected: () => {
            if (vModel.value) {
                set([], [])
            }
        },
        rowSelection: computed(() => {
            if (select.value) {
                return {
                    fixed: true,
                    columnWidth: 50,
                    selectedRowKeys: vModel.value ? selectedRowKeys.value : undefined,
                    ...(props.rowSelection || {}),
                    onChange: (rowKeys, rows) => {
                        if (vModel.value) {
                            set(rowKeys, rows)
                        }
                        props.rowSelection?.onChange && props.rowSelection.onChange(rowKeys, rows)
                    }
                }
            }
            return null
        })
    }
}
