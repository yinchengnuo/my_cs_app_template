import { onMounted, onUnmounted, ref } from 'vue'

export default (component) => {
    let _height = 0
    const height = ref(0)
    const setHeight = () => {
        const _ = document.createElement('div')
        const el = component.value.getElementsByClassName('content_inner')[0] || _
        const container = el.getElementsByClassName('ant-spin-container')[0] || _
        const footer = container.getElementsByClassName('surely-table-footer')[0] || _
        const pagination = container.getElementsByClassName('surely-table-pagination')[0] || _
        const paginationStyle = pagination ? getComputedStyle(pagination) : {}
        height.value = el.offsetHeight - footer.offsetHeight - pagination.offsetHeight - +paginationStyle.marginTop.replace('px', '') - +paginationStyle.marginBottom.replace('px', '') - 1
        _.remove()
    }

    const observer = new ResizeObserver(
        ([
            {
                contentRect: { height }
            }
        ]) => {
            if (height !== _height) {
                _height = height
                setHeight()
            }
        }
    )

    onMounted(() => {
        observer.observe(component.value)
        onUnmounted(() => observer.disconnect())
    })
    return {
        height
    }
}
