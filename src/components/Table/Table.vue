<script setup>
import { error } from './index'
import Sortable from 'sortablejs'
import { message } from 'ant-design-vue'
import { getPathByIdInTree, thousandthDot } from '@/utils'
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, reactive, ref, useSlots, watch } from 'vue'

const props = defineProps([
    'sort',
    'page',
    'title',
    'total',
    'auto',
    'width',
    'rowKey',
    'height',
    'current',
    'data',
    'pageSize',
    'rowSelection',
    'scrollbar',
    'select',
    'selectModifiers',
    'unDragColumn',
    'defaultPageSizeOptions',
    'drag'
])

props.rowKey !== undefined && error('本组件不支持使用 rowKey 属性')

const instance = getCurrentInstance()

const defaultPageSizeOptions = props.defaultPageSizeOptions || ['50', '100', '200', '500']
const pageSizeOptions = props?.page
    ? defaultPageSizeOptions.includes(props?.page[props.pageSize || 'pageSize'].toString())
        ? defaultPageSizeOptions
        : [...defaultPageSizeOptions, props?.page[props.pageSize || 'pageSize'].toString()].sort((a, b) => Number(a) - Number(b))
    : defaultPageSizeOptions
const emits = defineEmits(['update:page', 'change', 'update:select', 'update:sort', 'drag'])

const refForm = ref()
const refComponent = ref()
const refTable = ref()
const sorter = ref({})
const slots = useSlots()
const data = ref([])
const scroll = ref({ x: '100%', y: 0 })
const columns = ref([])
const slotsDefault = ref(slots.default().filter((e) => !e.type.toString().startsWith('Symbol')))
const dotField = computed(() => slotsDefault.value.filter((e) => e.props && e.props.dot !== undefined).map((e) => e.props.dataIndex))

const summaryField = slotsDefault.value.filter((e) => e.props && e.props.summary !== undefined).map((e) => e.props.dataIndex)

slotsDefault.value.some((e) => !(e.props && e.props.title !== undefined)) && error('Table.Column title 属性不能为 undefined')
new Set(slotsDefault.value.map((e) => e?.props?.title ?? '')).size !== slotsDefault.value.length && error('Table.Column title 属性不能重复')

const selectColumns = computed(() => slotsDefault.value.map((e) => e.props.title))
const selectedColumns = ref([...slotsDefault.value.map((e) => e.props.title)])

const renderColumns = computed(() => (slots) => {
    return slots
        .filter((e) => !e.type.toString().startsWith('Symbol'))
        .filter((e) => selectedColumns.value.includes(e.props.title))
        .sort((a, b) => {
            if (columns.value.findIndex((e) => e.title === a.props.title) === -1 || columns.value.findIndex((e) => e.title === b.props.title) === -1) {
                return 0
            } else {
                return columns.value.findIndex((e) => e.title === a.props.title) - columns.value.findIndex((e) => e.title === b.props.title)
            }
        })
})

const scroller = {
    ing: false,
    timer: null,
    startX(el, x) {
        if (this.ing) {
            return
        }
        this.ing = true
        this.timer = setInterval(() => {
            el?.scrollBy(x, el.scrollTop)
        })
    },
    startY(el, y) {
        if (this.ing) {
            return
        }
        this.ing = true
        this.timer = setInterval(() => {
            el?.scrollBy(el.scrollLeft, y)
        })
    },
    end() {
        this.ing = false
        this.timer && clearInterval(this.timer)
    }
}

let RowSorter
let ColumnSorter
const DragScroll = { x: 0, y: 0 }

const dragColumns = async () => {
    await nextTick()
    selectedRowKeys.value = []
    if (data.value.length) {
        const th = instance.refs.refComponent.getElementsByClassName('ant-table-thead')[0].children[0]
        const x = th.parentElement?.parentElement?.parentElement?.getClientRects()[0]?.x || 0
        const left = Array.from(th.getElementsByClassName('ant-table-cell-fix-left')).reduce((t, e) => t + e.offsetWidth, 0)
        const right = Array.from(th.getElementsByClassName('ant-table-cell-fix-right')).reduce((t, e) => t + e.offsetWidth, 0)
        const width = th.parentElement?.parentElement?.parentElement?.offsetWidth
        th.ondrag = (e) => {
            if (e.screenX - x - left < 200 || x + width - right - e.screenX < 40) {
                if (e.screenX - x - left < 200) {
                    scroller.startX(th?.parentElement?.parentElement?.parentElement?.nextElementSibling, -5)
                }
                if (x + width - right - e.screenX < 40) {
                    scroller.startX(th?.parentElement?.parentElement?.parentElement?.nextElementSibling, 5)
                }
            } else {
                scroller.end()
            }
        }
        th.ondragend = () => {
            scroller.end()
        }
        !props.unDragColumn &&
            (ColumnSorter = Sortable.create(th, {
                animation: 200,
                onEnd: ({ newIndex, oldIndex }) => {
                    if (
                        columns.value[newIndex].el.getAttribute('_title') &&
                        !Array.from(columns.value[newIndex].el.classList).includes('ant-table-cell-fix-left') &&
                        !Array.from(columns.value[newIndex].el.classList).includes('ant-table-cell-fix-right') &&
                        !Array.from(columns.value[oldIndex].el.classList).includes('ant-table-cell-fix-left') &&
                        !Array.from(columns.value[oldIndex].el.classList).includes('ant-table-cell-fix-right')
                    ) {
                        const newItem = columns.value[oldIndex]
                        const oldItem = columns.value[newIndex]
                        columns.value[newIndex] = newItem
                        columns.value[oldIndex] = oldItem
                    }
                    nextTick(() => {
                        ColumnSorter.sort(columns.value.map((e) => e.id))
                        getScrollY()
                    })
                },
                onUnchoose() {
                    scroller.end()
                }
            }))
        columns.value = Array.from(th.children).map((el, index) => {
            const slot = slotsDefault.value.find((e) => e.props.title === el.getAttribute('_title'))
            return {
                el: el,
                id: ColumnSorter ? ColumnSorter.toArray()[index] : '',
                title: el.getAttribute('_title') || '',
                width: slot?.props?.width
                    ? +slot?.props?.width.toString().replace('px', '')
                    : (refComponent.value.children[0].children[0].offsetWidth - (props.select ? 49 : 0) - (props.drag ? 55 : 0)) / selectedColumns.value.length - 5
            }
        })
    }
}

watch(
    () => selectedColumns.value,
    () => nextTick(dragColumns)
)

watch(() => data.value, dragColumns, { immediate: true })

const getScrollY = async () => {
    if (props.auto || props.auto === '') {
        return
    }
    nextTick(() => {
        const elH = refComponent.value.offsetHeight
        const tbody = refComponent.value.getElementsByClassName('ant-table-body')[0]
        const headerH = refComponent.value.getElementsByClassName('__header')[0]?.offsetHeight || 0
        const paginatioinH = refComponent.value.getElementsByClassName('ant-pagination')[0] ? 50 : 0
        const theadH = refComponent.value.getElementsByClassName('ant-table-thead')[0]?.offsetHeight || 0
        scroll.value.y = elH - headerH - paginatioinH - theadH - (summaryField.length ? 40 : 0)
        nextTick(() => {
            tbody.style.height = `${scroll.value.y}px`
            if (!data.value.length) {
                refComponent.value.getElementsByClassName('ant-table-placeholder')[0].style.height = `${scroll.value.y - 21}px`
            }
            if (DragScroll.x || DragScroll.y) {
                tbody.scrollTo(DragScroll.x, DragScroll.y)
                DragScroll.x = DragScroll.y = 0
            }
            if (data.value.length && props.drag) {
                const el = tbody.getElementsByClassName('ant-table-tbody')[0]
                const [{ y }] = el.getClientRects()
                Array.from(el.children)
                    .filter((e) => e.getAttribute('data-row-key') && !data.value.find((ee) => ee.id === e.getAttribute('data-row-key')))
                    .forEach((e) => {
                        e.remove()
                    })
                RowSorter = Sortable.create(el, {
                    animation: 200,
                    handle: '.__drag',
                    onEnd({ oldIndex, newIndex }) {
                        if (oldIndex !== newIndex) {
                            DragScroll.y = tbody.scrollTop
                            DragScroll.x = tbody.scrollLeft
                            emits('drag', (newIndex || 0) - 1, (oldIndex || 0) - 1)
                        }
                    }
                })
                el.ondrag = (e) => {
                    if (e.screenY - y < 120 || y + scroll.value.y - e.screenY < 40) {
                        if (e.screenY - y < 80) {
                            scroller.startY(tbody, -5)
                        }
                        if (y + scroll.value.y - e.screenY < 40) {
                            scroller.startY(tbody, 5)
                        }
                    } else {
                        scroller.end()
                    }
                }
                el.ondragend = () => {
                    scroller.end()
                }
            } else {
                RowSorter && RowSorter.destroy()
            }
        })
    })
}

const render = async (onMounted) => {
    data.value = []
    emits('update:select', [])
    instance.exposed.edits.length = 0
    if (props.drag && RowSorter && RowSorter.el) {
        Array.from(RowSorter.el.children)
            .filter((e) => e.getAttribute('data-row-key'))
            .forEach((e) => {
                e.remove()
            })
        await nextTick()
    }
    data.value = JSON.parse(JSON.stringify(props.data))
    !onMounted && getScrollY()
}

let _height = 0
const observer = new ResizeObserver(
    ([
        {
            contentRect: { height }
        }
    ]) => {
        if (height !== _height) {
            _height = height
            getScrollY()
        }
    }
)
onMounted(() => {
    render(true)
    observer.observe(refComponent.value)
})

watch(
    () => props.data,
    () => render(),
    { deep: true }
)

onUnmounted(() => {
    observer.disconnect()
})

const selectedRowKeys = ref([])

if (props.select) {
    watch(
        () => props.select,
        () => {
            if (props?.select?.length && typeof props?.select[0] === 'object') {
                selectedRowKeys.value = props.select?.map((item) => item[props.rowKey || 'id'])
            } else {
                selectedRowKeys.value = props.select
            }
        },
        {
            deep: true,
            immediate: true
        }
    )
}

const tableChange = (...e) => {
    const sort = {}
    const page = { [props.current || 'current']: e[0].current, [props.pageSize || 'pageSize']: e[0].pageSize, [props.total || 'total']: props.page?.total }
    emits('update:page', page)
    if (e[2].field) {
        sorter.value = { [e[2].field]: e[2].order }
        const props = slotsDefault.value.find((ee) => ee.props?.dataIndex === e[2].field).props || {}
        Object.assign(sort, e[2].order ? { [props.sortField || e[2].field + 'Sort']: props[e[2].order] ?? e[2].order } : {})
        emits('update:sort', sort)
    }
    selectedRowKeys.value = []
    emits('change', { ...page, ...props.sort, ...sort })
}

const onChange = (keys) => {
    selectedRowKeys.value = keys
    const selectModifiers = Object.keys(props.selectModifiers || {})
    let emitsData = []
    if (selectModifiers.length) {
        if (selectModifiers.length === 1) {
            emitsData = props.data.filter((e) => keys.includes(e.id)).map((e) => e[selectModifiers[0]])
        } else {
            emitsData = props.data.filter((e) => keys.includes(e.id)).map((e) => ({ ...selectModifiers.reduce((result, item) => ({ ...result, [item]: e[item] }), {}) }))
        }
    } else {
        emitsData = props.data.filter((e) => keys.includes(e.id))
    }
    emits('update:select', emitsData)
}

const edits = reactive([])
defineExpose({
    edits,
    selectedColumns,
    getData: () => {
        const _data = JSON.parse(JSON.stringify(data.value))
        _data.forEach((e) => {
            if (e.id.startsWith('ADD__')) {
                delete e.id
            }
        })
        return _data
    },
    add(item) {
        props.page && error('分页表格无法新增')
        if (edits.length) {
            message.warning('当前有正在 新增/编辑 的数据！请 保存/取消 后重试！')
            return
        }
        selectedColumns.value = [...selectColumns.value]
        const id = 'ADD__' + Date.now()
        edits.push({ ...item, id })
        data.value.push(edits.at(-1))
        getScrollY()
    },
    edit(scoped) {
        !scoped && data.value.some((e) => e.children) && error('树形表格不能使用整体编辑')
        if (edits.length) {
            if (scoped) {
                message.warning('当前有正在 新增/编辑 的数据！请 保存/取消 后重试！')
            }
            return
        }
        selectedColumns.value = [...selectColumns.value]
        edits.push(...(scoped ? [scoped.record] : data.value))
        getScrollY()
    },
    save(scoped) {
        const records = scoped ? [scoped.record] : data.value
        selectedColumns.value = [...selectColumns.value]
        return new Promise((resolve, reject) => {
            refForm.value
                .validate(
                    records.reduce(
                        (result, record) => [
                            ...result,
                            ...slotsDefault.value
                                .filter((e) => e.props && e.props.dataIndex)
                                .map((e) => e.props.dataIndex)
                                .map((field) => [...getPathByIdInTree(data.value, record.id), field])
                        ],
                        []
                    )
                )
                .then((value) => {
                    if (scoped) {
                        const result = JSON.parse(JSON.stringify(Object.assign(scoped.record, value[0])))
                        if (result.id.startsWith('ADD__')) {
                            delete result.id
                        }
                        resolve(result)
                    } else {
                        resolve(JSON.parse(JSON.stringify(data.value)))
                    }
                })
                .catch(reject)
        })
    },
    cancel(scoped) {
        selectedColumns.value = [...selectColumns.value]
        edits.length = 0
        scoped && data.value.pop()
        data.value = JSON.parse(JSON.stringify(props.data))
        getScrollY()
    }
})

const customRender = ({ text, column: { dataIndex } }) => {
    if (dotField.value.includes(dataIndex)) {
        text = thousandthDot(text)
    }
    return (text ?? '').toString().trim() || '-'
}

const resizeColumn = (width, { title }) => {
    if (columns.value.length) {
        columns.value.find((e) => e.title === title).width = width
        getScrollY()
    }
}
</script>

<template>
    <div :style="{ height: props.auto || props.auto === '' ? 'auto' : props.height || '100%', width: props.width || 'auto', position: 'relative' }" v-bind="$attrs">
        <div class="custom_component" :class="{ header: $slots.header }" :style="{ position: props.auto || props.auto === '' ? 'static' : 'absolute' }" ref="refComponent">
            <a-form ref="refForm" :model="data">
                <div v-if="$slots.header" class="__header flex flex_sp" style="box-sizing: border-box; padding: 10px 0">
                    <div class="flex">
                        <h3 v-if="props.title" style="margin: 0">{{ props.title }}</h3>
                        <a-dropdown :getPopupContainer="() => refForm.$el">
                            <a-tooltip title="请选择列表中要展示的信息">
                                <div class="__header_dropdown" style="margin-left: 8px" />
                            </a-tooltip>
                            <template #overlay>
                                <div class="__header_dropdown_content">
                                    <div class="flex flex_sb __header_dropdown_content_header" @click.stop="() => {}">
                                        <a-checkbox
                                            :checked="selectColumns.length === selectedColumns.length"
                                            style="user-select: none"
                                            @change="(e) => (selectedColumns = e.target.checked ? [...selectColumns] : [])"
                                            >全部</a-checkbox
                                        >
                                    </div>
                                    <a-checkbox-group v-model:value="selectedColumns" class="__header_dropdown_checkbox" @click.stop="() => {}">
                                        <template v-for="item in selectColumns" :key="item">
                                            <a-checkbox v-if="item.trim()" :value="item">{{ item }}</a-checkbox>
                                        </template>
                                    </a-checkbox-group>
                                </div>
                            </template>
                        </a-dropdown>
                    </div>
                    <div class="flex1">
                        <slot name="header" />
                    </div>
                </div>
                <a-table
                    bordered
                    rowKey="id"
                    size="small"
                    class="cutom_table"
                    ref="refTable"
                    :dataSource="data"
                    @change="tableChange"
                    @resizeColumn="resizeColumn"
                    :scroll="props.auto || props.auto === '' ? { x: '100%' } : scroll"
                    :style="{ margin: $slots.header ? '0 2px!important' : '0px!important' }"
                    :pagination="
                        props.page
                            ? {
                                  size: 'default',
                                  pageSizeOptions,
                                  showSizeChanger: true,
                                  showQuickJumper: true,
                                  total: props.page[props.total || 'total'],
                                  current: props.page[props.current || 'current'],
                                  pageSize: props.page[props.pageSize || 'pageSize'],
                                  defaultPageSize: props.page[props.pageSize || 'pageSize'],
                                  showTotal: () => `${props.page[props.total || 'total']}条数据`
                              }
                            : false
                    "
                    :rowClassName="(_, index) => (index % 2 === 1 ? 'table_striped' : null)"
                    :rowSelection="props.select && selectedColumns.length ? { columnWidth: '49px', onChange, selectedRowKeys, fixed: 'left', ...(props.rowSelection || {}) } : undefined"
                    v-bind="$attrs"
                >
                    <template #emptyText>
                        <div class="flexc">
                            <img src="@/assets/components/empty.png" :style="{ height: scroll.y / 2 + 'px', objectFit: 'cover' }" />
                            <div :style="{ fontSize: 28 + 'px', color: '#000000' }">暂无数据记录</div>
                        </div>
                    </template>
                    <template #summary>
                        <a-table-summary v-if="summaryField.length && data.length" fixed>
                            <a-table-summary-row>
                                <a-table-summary-cell v-if="props.select" :index="0">合计</a-table-summary-cell>
                                <a-table-summary-cell v-for="(item, index) in renderColumns(slots.default())" :key="item.props?.title" :index="props.select ? index + 1 : index">{{
                                    summaryField.includes(item.props?.dataIndex) ? thousandthDot(data.reduce((t, e) => t + Number(e[item.props?.dataIndex]), 0)) : ''
                                }}</a-table-summary-cell>
                            </a-table-summary-row>
                        </a-table-summary>
                    </template>
                    <a-table-column v-if="props.drag && selectedColumns.length" :width="55" fixed="left" :customCell="(record) => ({ class: props.drag && props.drag(record) ? '__drag' : '' })">
                        <template #default="{ record }">
                            <img v-if="props.drag && props.drag(record)" src="@/assets/components/drag.png" width="21" draggable="false" />
                        </template>
                    </a-table-column>
                    <template v-for="item in renderColumns(slots.default())" :key="item.props.title">
                        <component
                            :is="item"
                            :ellipsis="true"
                            :sorter="item.props?.sort !== undefined"
                            :sortOrder="sorter[item.props.dataIndex]"
                            :customCell="(_, __, { dataIndex }) => ({ dataIndex })"
                            :resizable="!Boolean(item.props.fixed) && data.length"
                            :customRender="item.children ? undefined : customRender"
                            :customHeaderCell="({ title: _title, key }) => ({ _title: typeof _title === 'object' ? key : _title })"
                            v-bind="item.props"
                            :width="columns.length ? columns.find((e) => e.title === item.props.title)?.width || 0 : +(item.props.width || '').toString().replace('px', '')"
                        />
                    </template>
                    <template v-if="$slots.expandIcon" #expandIcon="scoped">
                        <slot name="expandIcon" v-bind="scoped" />
                    </template>
                    <template v-if="$slots.expandedRowRender" #expandedRowRender="scoped">
                        <slot name="expandedRowRender" v-bind="scoped" />
                    </template>
                </a-table>
            </a-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './header.scss';
.custom_component {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(108, 137, 137, 0.12);
    &.header {
        padding: 0 11px;
    }
    .cutom_table {
        width: 100%;
        :deep(.ant-table) {
            .ant-table-container {
                border: none;
                border-right: 1px solid #fff;
            }
            .ant-table-thead th,
            .ant-table-tbody,
            td {
                height: 40px;
                font-size: 14px;
                font-weight: 400;
                color: #565169;
                letter-spacing: 0;
                padding: 2.5px 20px;
                &:last-child {
                    border-right-color: #fff;
                }
                &.ant-table-selection-column {
                    padding: 0;
                }
                &.draggable {
                    cursor: grab;
                    user-select: none;
                }
                .ant-btn {
                    padding: 0;
                    padding-right: 20px;
                    &:last-child {
                        padding-right: 0;
                    }
                }
            }
            .ant-table-thead th {
                cursor: grab;
                font-weight: 500;
                color: #333545;
                background: #f8fafa;
            }

            .ant-table-summary {
                td {
                    height: 40px;
                    overflow: hidden;
                    text-align: right;
                    padding: 2.5px 20px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    &:first-child {
                        padding: 0;
                        text-align: center;
                    }
                }
            }

            .ant-table-header {
                > table {
                    border: none;
                }
            }
            .ant-table-body {
                &::-webkit-scrollbar {
                    width: 8px !important;
                    height: 8px !important;
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 4px !important;
                    background-color: #d2d1d5 !important;
                }
                &::-webkit-scrollbar-track {
                    border-radius: 4px !important;
                    background-color: #fff !important;
                }
                .ant-table-placeholder {
                    > td {
                        padding: 0;
                        border: none;
                    }
                    .ant-table-expanded-row-fixed {
                        &::after {
                            display: none;
                        }
                    }
                }
            }
        }
        :deep(.ant-table-pagination) {
            margin: 8px 0;
            .ant-pagination-item {
                color: #565169;
                &.ant-pagination-item-active {
                    background: #0194fe;
                    > a {
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>
