<script setup>
import { getCurrentInstance, onMounted } from 'vue'
import { getPathByIdInTree, thousandthDot } from '@/utils'

const props = defineProps(['type', 'rules'])

const inputType = props.type || 'text'
const instance = getCurrentInstance()
const ctx = instance.parent.proxy
const table = instance.parent.parent.parent.proxy
const edits = instance.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.exposed.edits
onMounted(() => {
    ctx.$el.style.height = '62px'
})
</script>

<template>
    <div class="table_edit">
        <a-form-item
            v-if="edits.includes(ctx.record)"
            :name="[...getPathByIdInTree(table.data, ctx.record.id), ctx.column.dataIndex]"
            :rules="props.rules || [{ required: true, message: `请输入${ctx.column.title}`, type: inputType === 'number' ? 'number' : 'string', whitespace: true }]"
        >
            <a-input v-if="inputType === 'text'" v-model:value="ctx.record[ctx.column.dataIndex]" style="width: 100%" placeholder="请输入" v-bind="$attrs">
                <template v-for="(item, name, index) in $slots" :key="index" #[name]>
                    <component :is="item" />
                </template>
            </a-input>
            <a-textarea v-if="inputType === 'textarea'" v-model:value="ctx.record[ctx.column.dataIndex]" style="width: 100%" placeholder="请输入" v-bind="$attrs">
                <template v-for="(item, name, index) in $slots" :key="index" #[name]>
                    <component :is="item" />
                </template>
            </a-textarea>
            <a-input-number v-if="inputType === 'number'" v-model:value="ctx.record[ctx.column.dataIndex]" style="width: 100%" placeholder="请输入" v-bind="$attrs">
                <template v-for="(item, name, index) in $slots" :key="index" #[name]>
                    <component :is="item" />
                </template>
            </a-input-number>
            <a-select v-if="inputType === 'select'" v-model:value="ctx.record[ctx.column.dataIndex]" style="width: 100%" placeholder="请选择" v-bind="$attrs">
                <template v-for="(item, name, index) in $slots" :key="index" #[name]>
                    <component :is="item" />
                </template>
            </a-select>
            <a-tree-select v-if="inputType === 'tree-select'" v-model:value="ctx.record[ctx.column.dataIndex]" style="width: 100%" placeholder="请选择" v-bind="$attrs">
                <template v-for="(item, name, index) in $slots" :key="index" #[name]>
                    <component :is="item" />
                </template>
            </a-tree-select>

            <a-date-picker v-if="inputType === 'date'" v-model:value="ctx.record[ctx.column.dataIndex]" valueFormat="YYYY-MM-DD" style="width: 100%" placeholder="请选择日期" v-bind="$attrs">
                <template v-for="(item, name, index) in $slots" :key="index" #[name]>
                    <component :is="item" />
                </template>
            </a-date-picker>
        </a-form-item>
        <template v-else>
            <template v-if="$slots.default">
                <template v-for="(item, index) in $slots.default()" :key="index">
                    <component :is="item" />
                </template>
            </template>
            <template v-else>{{ ctx.column.dataIndex.dot === undefined ? ctx.record[ctx.column.dataIndex] : thousandthDot(ctx.record[ctx.column.dataIndex]) }}</template>
        </template>
    </div>
</template>

<script>
export default {
    name: 'TableEdit'
}
</script>

<style lang="scss" scoped>
.table_edit {
    :deep(.ant-form-item) {
        margin: 0 !important;
    }
}
</style>
