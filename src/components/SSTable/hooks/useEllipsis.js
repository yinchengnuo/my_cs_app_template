import { computed } from 'vue'

export default (columns) => ({
    columns: computed(() => {
        columns.value.forEach((e) => {
            if (e.ellipsis !== false) {
                e.ellipsis = true
            }
        })
        return columns.value
    })
})
