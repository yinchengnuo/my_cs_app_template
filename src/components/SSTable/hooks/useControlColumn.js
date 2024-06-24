import { nextTick, computed, ref, watch } from 'vue'

export default function (columns, PROPS, RefComponent = ref(document.body)) {
    let _columns = columns.value.map((e) => `${e.title}`)
    const selectedColumns = ref(columns.value.map((e) => `${e.title}`))
    watch(
        () => PROPS.columns,
        (n) => {
            const columns = n.map((e) => `${e.title}`)
            columns.forEach((title) => {
                if (!_columns.includes(title)) {
                    selectedColumns.value.push(title)
                }
            })
            _columns.forEach((title) => {
                if (!columns.includes(title)) {
                    selectedColumns.value.splice(selectedColumns.value.indexOf(title), 1)
                }
            })
            _columns = columns
        },
        { deep: true }
    )

    watch(
        selectedColumns,
        (n, o) => {
            if (n.length - o.length === -1) {
                const item = columns.value.find((e) => e.title === o.filter((e) => !n.includes(e))[0])
                if (item.align === 'right' && columns.value[columns.value.indexOf(item) + 1].align !== 'right') {
                    nextTick(() => {
                        const headers = Array.from(RefComponent.value.querySelectorAll('.surely-table-header-cell-title-inner'))
                        const rows = Array.from(RefComponent.value.querySelectorAll('.surely-table-center .surely-table-row:first-child .surely-table-cell-content'))
                        for (let i = 0; i < headers.length; i++) {
                            if (headers[i] && rows[i]) {
                                if (getComputedStyle(headers[i]).textAlign === 'left' && getComputedStyle(rows[i]).textAlign === 'right') {
                                    Array.from(RefComponent.value.querySelectorAll(`.surely-table-row .surely-table-cell:nth-child(${i + 1}) .surely-table-cell-content`)).forEach((e) => {
                                        getComputedStyle(e).textAlign === 'right' && e.style.setProperty('text-align', 'left')
                                    })
                                }
                            }
                        }
                    })
                }
            }
        },
        { deep: true }
    )
    return {
        selectedColumns,
        selectAll: (e) => {
            if (e.target.checked) {
                selectedColumns.value = columns.value.map((e) => `${e.title}`)
            } else {
                selectedColumns.value = []
            }
        },
        columns: computed(() => columns.value.filter((e) => selectedColumns.value.includes(`${e.title}`)))
    }
}
