import { computed } from 'vue'
import { numberToLocaleString } from '..'

export default (columns, data, select) => ({
    summaryColumns: computed(() => {
        if (!columns.value.length || !data.value.length) return []
        const numbers = columns.value.filter((e) => e.summary === true).map((e) => `${e.dataIndex}`)
        const target = JSON.parse(JSON.stringify(data.value[0]))
        Object.keys(target).forEach((key) => {
            if (numbers.includes(key)) {
                const summary = data.value.reduce((t, e) => t + Number(e[`${key}`] ?? 0), 0)
                target[key] = isNaN(summary) ? '' : numberToLocaleString(summary)
            }
        })
        return select.value
            ? ['合计', ...columns.value.map((e) => (numbers.includes(`${e.dataIndex}`) ? target[`${e.dataIndex}`] : ''))]
            : columns.value.map((e) => (numbers.includes(`${e.dataIndex}`) ? target[`${e.dataIndex}`] : ''))
    })
})
