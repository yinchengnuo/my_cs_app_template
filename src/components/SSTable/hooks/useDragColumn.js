import { nextTick } from 'vue'

export default (columns, EMITS) => ({
    columns,
    columnDragEnd: (e) => {
        const findIndex = (column) => columns.value.findIndex((e) => e.title === column.title)
        const currentIndex = findIndex(e.column)
        const targetIndex = findIndex(e.targetColumn)
        ;[columns.value[targetIndex], columns.value[currentIndex]] = [columns.value[currentIndex], columns.value[targetIndex]]
        nextTick(() => EMITS('columnDragEnd', e))
    }
})
