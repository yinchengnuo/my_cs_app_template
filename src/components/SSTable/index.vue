<script setup>
import useSort from './hooks/useSort'
import useEdit from './hooks/useEdit'
import useTable from './hooks/useTable'
import useSelect from './hooks/useSelect'
import useHeight from './hooks/useHeight'
import useSummary from './hooks/useSummary'
import useEllipsis from './hooks/useEllipsis'
import useEmptyFill from './hooks/useEmptyFill'
import usePagination from './hooks/usePagination'
import useDragColumn from './hooks/useDragColumn'
import useResizeColumn from './hooks/useResizeColumn'
import useNumberFormat from './hooks/useNumberFormat'
import useControlColumn from './hooks/useControlColumn'

const PROPS = defineProps([
    'unCacheScroll',
    'sort',
    'rowKey',
    'dataSource',
    'autoHeaderHeight',
    'columns',
    'page',
    'pagination',
    'header',
    'headerIcon',
    'emptyText',
    'width',
    'total',
    'current',
    'pageSize',
    'select',
    'selectRowKey',
    'childrenColumnName',
    'hideHeaderControl',
    'rowSelection',
    'hideSummary',
    'tableXVirtual'
])

const EMITS = defineEmits(['change', 'columnDragEnd', 'update:page', 'update:sort', 'update:select', 'update:selectRowKey', 'headerIconClick'])

const { RefSTable, RefComponent, rowKey, columns, dataSource, childrenColumnName } = useTable(PROPS)
const { height } = useHeight(RefComponent)
const { onchange: onSortChange } = useSort(PROPS, EMITS)
const { rowSelection, clearSelected, select } = useSelect(PROPS, EMITS, rowKey)
const { pagination, onchange: onPaginationChange } = usePagination(PROPS, EMITS)
const { columns: columnsEllipsis } = useEllipsis(columns)
const { columns: columnsResizable } = useResizeColumn(columnsEllipsis)
const { columns: columnsDragColumn, columnDragEnd } = useDragColumn(columnsResizable, EMITS)
const { columns: columnsControlColumn, selectedColumns, selectAll } = useControlColumn(columnsDragColumn, PROPS, RefComponent)
const { summaryColumns } = useSummary(columnsControlColumn, dataSource, select)

const change = (pagination, filters, sorter, info) => {
    clearSelected()
    if (info.action === 'sort') onSortChange(sorter)
    if (info.action === 'paginate') onPaginationChange(pagination)
    queueMicrotask(() => EMITS('change', pagination, filters, sorter, info))
}

const { RefForm, add, edit, save, validate, cancel, virtual, xVirtual, dataChange, editing, edits, getFormItemName } = useEdit({
    rowKey,
    columns,
    selectAll,
    dataSource,
    childrenColumnName
})

defineExpose({
    add,
    edit,
    save,
    edits,
    cancel,
    editing,
    validate
})
</script>

<template>
    <div ref="RefComponent" class="component" :style="{ paddingBottom: PROPS.page || PROPS.pagination ? '0px' : '8px' }">
        <div v-if="PROPS.header || $slots.header" class="header">
            <div class="header_left">
                <h3 v-if="PROPS.header" style="margin: 0">{{ PROPS.header ?? '' }}</h3>
                <a-tooltip v-if="headerIcon" title="请选择列表中要展示的信息">
                    <div class="__header_dropdown" @click="EMITS('headerIconClick')" style="margin-left: 8px; cursor: pointer" />
                </a-tooltip>
                <a-dropdown v-else :getPopupContainer="() => RefComponent">
                    <a-tooltip title="请选择列表中要展示的信息">
                        <div class="__header_dropdown" style="margin-left: 8px" />
                    </a-tooltip>
                    <template #overlay>
                        <div class="__header_dropdown_content">
                            <div class="flex flex_sb __header_dropdown_content_header" @click.stop="() => {}">
                                <a-checkbox
                                    :indeterminate="Boolean(selectedColumns.length) && selectedColumns.length !== columns.length"
                                    :checked="selectedColumns.length === columns.length"
                                    style="user-select: none"
                                    @change="selectAll"
                                    >全部</a-checkbox
                                >
                            </div>
                            <a-checkbox-group v-model:value="selectedColumns" class="__header_dropdown_checkbox" @click.stop="() => {}">
                                <a-checkbox v-for="item in PROPS.columns.map((e) => `${e.title}`)" :key="item" :value="item">{{ item }}</a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </template>
                </a-dropdown>
            </div>
            <div class="header_right">
                <slot name="header" />
            </div>
        </div>
        <div class="content">
            <div class="content_inner" :class="{ empty: PROPS.dataSource.length === 0 && !$slots.emptyText, __un_autoHeaderHeight: !PROPS.autoHeaderHeight }">
                <a-form ref="RefForm" :model="dataSource">
                    <s-table
                        bordered
                        columnDrag
                        ref="RefSTable"
                        :rowHeight="40"
                        :height="height"
                        :rowKey="rowKey"
                        summaryFixed="bottom"
                        :pagination="pagination"
                        :rowSelection="rowSelection"
                        :columns="columnsControlColumn"
                        :dataSource="dataSource"
                        @change="change"
                        @columnDragEnd="columnDragEnd"
                        :autoHeaderHeight="PROPS.autoHeaderHeight"
                        v-bind="$attrs"
                        :virtual="virtual"
                        :xVirtual="typeof PROPS.tableXVirtual === 'boolean' ? tableXVirtual : xVirtual"
                    >
                        <template v-if="$slots.title" #title="scope">
                            <slot name="title" v-bind="scope" />
                        </template>
                        <template v-if="$slots.footer" #footer="scope">
                            <slot name="footer" v-bind="scope" />
                        </template>
                        <template v-if="$slots.summary && !PROPS.hideSummary" #summary="scope">
                            <slot name="summary" v-bind="scope" />
                        </template>
                        <template #summary v-else-if="summaryColumns.length > (select ? 1 : 0) && dataSource.length && !PROPS.hideSummary">
                            <s-table-summary-row align="right">
                                <s-table-summary-cell v-for="(item, index) in summaryColumns" :key="index" :index="index">{{ item }}</s-table-summary-cell>
                            </s-table-summary-row>
                        </template>
                        <template #bodyCell="scope">
                            <a-form-item
                                v-if="scope.column.edit && edits.includes(scope.record)"
                                :name="getFormItemName(scope.recordIndexs, scope.column.dataIndex)"
                                :id="`${scope.record[rowKey]}_${scope.column.dataIndex}`"
                                v-bind="scope.column.edit?.formItemProps"
                                style="margin: 0"
                            >
                                <component
                                    :is="scope.column.edit.component()"
                                    v-bind="scope.column.edit?.componentProps"
                                    v-model:value="edits.find((e) => e[rowKey] === scope.record[rowKey])[scope.column.dataIndex]"
                                    @change="dataChange"
                                />
                            </a-form-item>
                            <template v-else-if="useEmptyFill(scope, PROPS)">{{ useEmptyFill(scope, PROPS) }}</template>
                            <template v-else-if="useNumberFormat(scope)">{{ useNumberFormat(scope) }}</template>
                            <slot v-else name="bodyCell" v-bind="scope" />
                        </template>
                        <template v-if="$slots.emptyText" #emptyText="scope">
                            <slot name="emptyText" v-bind="scope" />
                        </template>
                        <template v-else #emptyText>
                            <img src="@/assets/components/empty.png" />
                            <span>暂无数据记录</span>
                        </template>
                        <template v-if="$slots.indicator" #indicator="scope">
                            <slot name="indicator" v-bind="scope" />
                        </template>
                        <template v-if="$slots.headerCell" #headerCell="scope">
                            <slot name="headerCell" v-bind="scope" />
                        </template>
                        <template v-if="$slots.expandIcon" #expandIcon="scope">
                            <slot name="expandIcon" v-bind="scope" />
                        </template>
                        <template v-if="$slots.rowDragGhost" #rowDragGhost="scope">
                            <slot name="rowDragGhost" v-bind="scope" />
                        </template>
                        <template v-if="$slots.columnDragGhost" #columnDragGhost="scope">
                            <slot name="columnDragGhost" v-bind="scope" />
                        </template>
                        <template v-if="$slots.customFilterIcon" #customFilterIcon="scope">
                            <slot name="customFilterIcon" v-bind="scope" />
                        </template>
                        <template v-if="$slots.expandedRowRender" #expandedRowRender="scope">
                            <slot name="expandedRowRender" v-bind="scope" />
                        </template>
                        <template v-if="$slots.customFilterDropdown" #customFilterDropdown="scope">
                            <slot name="customFilterDropdown" v-bind="scope" />
                        </template>
                    </s-table>
                </a-form>
            </div>
        </div>
        <div class="bottom">
            <slot name="bottom" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
