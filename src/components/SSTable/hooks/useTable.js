/* eslint-disable indent */
import { error } from '..'
import { computed, nextTick, onActivated, onDeactivated, onMounted, ref, unref, watch } from 'vue'

export default (PROPS) => {
    try {
        if ({}.toString.call(PROPS.columns) !== '[object Array]') {
            error('columns 必须为数组类型数据')
        }
    } catch (_) {
        error('columns 必须为数组类型数据')
    }
    try {
        if ({}.toString.call(PROPS.dataSource) !== '[object Array]') {
            error('dataSource 必须为数组类型数据')
        }
    } catch (_) {
        error('dataSource 必须为数组类型数据')
    }

    const RefSTable = ref()
    const RefComponent = ref(document.body)

    let lock = false
    const rowKey = computed(() => PROPS.rowKey || 'id')
    const childrenColumnName = computed(() => PROPS.childrenColumnName || 'children')

    const columns = ref(PROPS.columns.slice())
    const dataSource = ref(PROPS.dataSource.slice())

    const crack = () => {
        Array.from(RefComponent.value.getElementsByClassName('surely-table')[0].children).find((e) => e.innerHTML === 'Unlicensed Product').innerHTML = ''
        Array.from(RefComponent.value.getElementsByClassName('surely-table-body')[0].children).find((e) => e.innerHTML === 'Powered by Surely Vue').innerHTML = ''
    }

    watch(
        () => columns,
        () => {
            if (lock) return
            lock = true
            columns.value = columns.value.slice()
            nextTick(() => (lock = false))
        },
        { deep: true }
    )
    watch(
        () => PROPS.columns,
        (n) => {
            if (lock) return
            lock = true
            new Set(n.map((e) => e.title)).size !== n.length && error('Table Column title 属性不能重复')
            n.some((e) => e.title === null || e.title === undefined) && error('Table Column title 属性不能为 null/undefined')
            columns.value = n.slice()
            nextTick(() => (lock = false))
        },
        { deep: true }
    )

    watch(
        () => PROPS.dataSource,
        () => (dataSource.value = PROPS.dataSource.slice()),
        { deep: true }
    )

    const scroll = { top: 0, left: 0 }

    onMounted(() => {
        crack()
    })

    onActivated(() => {
        if (unref(PROPS.unCacheScroll) === false) {
            setTimeout(() => RefSTable.value.scrollTo(scroll))
        }
    })

    onDeactivated(() => {
        if (unref(PROPS.unCacheScroll) === false) {
            scroll.top = RefSTable?.value?.body?.scrollTop ?? 0
            scroll.left = RefSTable?.value?.body?.scrollLeft ?? 0
        }
    })

    return { rowKey, columns, RefSTable, dataSource, RefComponent, childrenColumnName }
}

const _error = console.error
console.error = function () {
    switch (arguments[0]) {
        case '****************************************************************************************************************':
            return
        case '***************************************** Surely Vue Enterprise License *******************************************':
            return
        case '****************************************** License Key Not Found ***********************************************':
            return
        case '* All Surely Vue Enterprise features are unlocked.                                                                *':
            return
        case '* This is an evaluation only version, it is not licensed for development projects intended for production.     *':
            return
        case '* If you want to hide the watermark, please email antdv@foxmail.com for a license.                        *':
            return
        // eslint-disable-next-line max-len
        case 'Warning: [@surely-vue/table: Table] `dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.':
            return
    }

    _error.call(this, ...arguments)
}
