import { computed } from 'vue'

export default (columns) => ({
    columns: computed(() => {
        columns.value.forEach((e) => {
            if (e.resizable !== false) {
                e.resizable = true
            }
        })
        return columns.value
    })
})
