<script setup>
import { useSlots, ref, watch, nextTick, onMounted, computed } from 'vue'

const Components = import.meta.glob('./components/*.vue', { eager: true })
Object.entries(Components).forEach(([key, value]) => {
    Components[key.replaceAll('./components/', '').replaceAll('.vue', '')] = value
    delete Components[key]
})

const props = defineProps(['wrap', 'width', 'spaceX', 'spaceY', 'modelValue', 'itemAfter', 'hideRight', 'itemBefore', 'modelModifiers', 'text'])

const bottoms = ref([])
const emits = defineEmits(['query', 'reset', 'change'])

const model = ref(JSON.parse(JSON.stringify(props.modelValue || {})))

const refForm = ref()
const refAForm = ref()
const computBottom = () => {
    if (refForm.value && refForm.value.getElementsByClassName) {
        const form = refForm.value.getElementsByClassName('ant-form')[0]
        if (form) {
            bottoms.value = Array.from(form.children).map((item) => Math.abs(item.offsetTop + item.offsetHeight - form.offsetHeight) <= 2)
        }
    }
}

const slots = useSlots()
const slotsFormItem = () => slots.default().filter((e) => Components[e.type.name])

const fillValue = (itemProps, value) => {
    if (props.modelModifiers?.fill) {
        if (value === undefined) {
            if (itemProps.fill === undefined) {
                return ''
            } else {
                return itemProps.fill
            }
        }
    }
    return value
}

const getIdByIdInTree = (arr, id) => {
    const result = []
    const find = (arr, path, deep) => {
        for (let i = 0; i < arr.length; i++) {
            path[deep] = arr[i].id
            path.length = deep + 1
            if (arr[i].id === id) {
                Object.assign(result, path)
                break
            } else {
                if (arr[i].children) {
                    find(arr[i].children, path, deep + 1)
                }
            }
        }
    }
    find(arr, [], 0)
    return result
}

const emitValue = () => {
    nextTick(() => emits('change'))
    Object.entries(model.value).forEach(([key, value]) => {
        if (slotsFormItem().find((e) => e.props?.name === key)?.type?.name === 'FormRange') {
            const range = key.split(',')
            if (!value) {
                props.modelValue[range[0]] = undefined
                props.modelValue[range[1]] = undefined
                return undefined
            }
            if (value[0] !== undefined) {
                props.modelValue[range[0]] = value[0]
            }
            if (value[1] !== undefined) {
                props.modelValue[range[1]] = value[1]
            }
            return
        }
        if (slotsFormItem().find((e) => e.props?.name === key)?.type?.name === 'FormSelectTree') {
            if (value.length) {
                props.modelValue[key] = value.at(-1)
            } else {
                props.modelValue[key] = slotsFormItem().find((e) => e.props.name === key).props.fill || (props.modelModifiers?.fill ? '' : undefined)
            }
            return
        }
        if (slotsFormItem().find((e) => e.props?.name === key)?.type?.name === 'FormCheckbox') {
            if (value.length) {
                props.modelValue[key] = value.join(',')
            } else {
                props.modelValue[key] = ''
            }
            return
        }
        if (!(typeof value === 'object' && value !== null)) {
            props.modelValue[key] = value
        }
    })
}

const setValue = () => {
    model.value = JSON.parse(JSON.stringify(props.modelValue || {}))
    slotsFormItem().forEach((e) => {
        if (e.type.name === 'FormRange') {
            const range = e.props.name.toString().split(',')
            if (range.length !== 2) {
                throw new Error('FormRange 组件 name 属性长度不为 2')
            }
            model.value[range.join()] = [fillValue(e.props, props.modelValue[range[0]]), fillValue(e.props, props.modelValue[range[1]])]
            return
        }
        if (e.type.name === 'FormSelectTree') {
            const id = props.modelValue[e.props.name] || e.props.value
            model.value[e.props.name] = id ? getIdByIdInTree(e.props.options || [], id) : []
            return
        }
        if (e.type.name === 'FormCheckbox') {
            const value = props.modelValue[e.props.name] || e.props.value
            model.value[e.props.name] = value ? value.split(',') : []
            return
        }
        model.value[e.props.name] = fillValue(e.props, e.props.name === undefined || props.modelValue[e.props.name] === undefined ? e.props.value : props.modelValue[e.props.name])
    })
    emitValue()
}

watch(() => props.modelValue, setValue, {
    deep: true,
    immediate: true
})

watch(() => model.value, emitValue, {
    deep: true
})

const reset = () => {
    refAForm.value.resetFields()
    nextTick(() => {
        emits('reset')
    })
}

const renderItem = computed(() => (solts) => {
    return solts.filter((e) => !e.type.toString().startsWith('Symbol'))
})

watch(
    () => props.spaceY,
    () => {
        nextTick(computBottom)
    }
)

const Expose = { setValue, reset }
defineExpose(Expose)
onMounted(() => {
    Object.assign(Expose, refAForm.value)
    computBottom()
})
</script>

<template>
    <div ref="refForm" class="w100 form">
        <slot name="header" />
        <div class="body flex flex_c_fs">
            <a-form ref="refAForm" :labelCol="{ span: '80px' }" :class="['flex1', Boolean(props.wrap || props.wrap === '') ? 'form_row_wrap' : '']" :model="model" layout="inline" v-bind="$attrs">
                <template v-for="(item, index) in renderItem($slots.default())" :key="index">
                    <div
                        :style="{
                            display: 'inline-block',
                            width: item.props?.width || props.width || '340px',
                            marginRight: item.props?.spaceX || props.spaceX || '26px',
                            paddingBottom: bottoms[index] ? '0px' : item.props?.spaceY || props.spaceY || '14px'
                        }"
                    >
                        <a-form-item v-bind="item.props">
                            <div class="flex flex_fs __form_item">
                                <component v-if="item?.children?.itemBefore && !(item.props?.itemBefore || props.itemBefore)" :is="item.children.itemBefore" />
                                <component
                                    :is="item"
                                    @pressEnter="$emit('query')"
                                    v-if="item.type.name === 'FormInput' && Boolean('number' in item.props)"
                                    v-model:value="model[`${item.props?.name}`]"
                                    :itemAfter="item.props?.itemAfter || props.itemAfter"
                                    :itemBefore="item.props?.itemBefore || props.itemBefore"
                                    :text="item.props?.text === undefined ? props.text : item.props?.text"
                                />
                                <component
                                    :is="item"
                                    @pressEnter="$emit('query')"
                                    v-else-if="item.type.name === 'FormInput' && !Boolean('number' in item.props)"
                                    v-model:value.trim="model[`${item.props?.name}`]"
                                    :itemAfter="item.props?.itemAfter || props.itemAfter"
                                    :itemBefore="item.props?.itemBefore || props.itemBefore"
                                    :text="item.props?.text === undefined ? props.text : item.props?.text"
                                />
                                <component
                                    v-else-if="item.type !== 'Form.Custom'"
                                    :is="item"
                                    @pressEnter="$emit('query')"
                                    v-model:value="model[`${item.props?.name}`]"
                                    :itemAfter="item.props?.itemAfter || props.itemAfter"
                                    :itemBefore="item.props?.itemBefore || props.itemBefore"
                                    :text="item.props?.text === undefined ? props.text : item.props?.text"
                                />
                                <component v-if="item?.children?.itemAfter && !(item.props?.itemAfter || props.itemAfter)" :is="item.children.itemAfter" />
                            </div>
                            <div v-if="item.type === 'Form.Custom'">
                                <component :is="item.children[0]" />
                            </div>
                        </a-form-item>
                    </div>
                </template>
            </a-form>
            <div v-if="!Boolean(props.hideRight || hideRight === '')" class="right">
                <slot name="rightTop" />
                <div class="buttons flex">
                    <slot name="buttonLeft" />
                    <a-button type="primary" @click="$emit('query')">查询</a-button>
                    <slot name="buttonCenter" />
                    <a-button @click="reset">重置</a-button>
                    <slot name="buttonRight" />
                </div>
                <slot name="rightBottom" />
            </div>
        </div>
        <slot name="footer" />
    </div>
</template>

<style lang="scss" scoped>
.form {
    position: relative;
    box-sizing: border-box;
    .body {
        :deep(.ant-form-item) {
            margin: 0;
            box-sizing: border-box;
            .ant-form-item-control-input {
                height: 100%;
            }
            .ant-form-item-control {
                flex: 1;
                .ant-select-selection-item {
                    white-space: normal;
                }
            }
        }
        .buttons {
            :not(:first-child) {
                margin-left: 8px;
            }
        }
    }
}

:deep(.ant-form-item) {
    margin: 0;
    width: 100%;
    .ant-form-item-label > label {
        height: 100%;
        font-weight: 400;
        color: #807c8e;
        letter-spacing: 0;
    }
    .ant-form-item-explain {
        z-index: 2;
        top: 92% !important;
        position: absolute !important;
    }
}
:deep(.form_row_wrap) {
    .ant-form-item {
        display: inline-block;
    }
}
</style>
