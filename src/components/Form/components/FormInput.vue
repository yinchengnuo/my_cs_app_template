<script setup>
import { ref } from 'vue'
import { thousandthDot } from '@/utils'

const component = ref()

defineProps(['value', 'itemAfter', 'itemBefore', 'text', 'search', 'number', 'pointer', 'textarea', 'password', 'disabled', 'readonly'])

defineExpose({ component })
</script>

<template>
    <span v-if="itemBefore" class="__form_item_before">{{ itemBefore }}</span>
    <template v-if="$slots.text">
        <component :is="$slots.text" v-bind="$attrs" />
    </template>
    <span v-else-if="text" class="__form_item_text" v-bind="$attrs">
        {{ thousandthDot(((typeof text === 'boolean' ? false : text) || (value === undefined ? '' : value).toString() || (number ? 0 : '-')).toString()) }}
    </span>
    <a-input-search
        ref="component"
        v-else-if="search"
        :allowClear="disabled || readonly ? false : true"
        class="flex1"
        :value="value"
        :placeholder="disabled || readonly ? '' : '请输入'"
        :class="{ pointer: pointer }"
        :disabled="!!disabled"
        :readonly="!!readonly"
        v-bind="$attrs"
    >
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-input-search>
    <a-textarea
        ref="component"
        v-else-if="textarea"
        :allowClear="disabled || readonly ? false : true"
        class="flex1"
        :value="value"
        :maxlength="200"
        :placeholder="disabled || readonly ? '' : '请输入'"
        :class="{ pointer: pointer }"
        :disabled="!!disabled"
        :readonly="!!readonly"
        v-bind="$attrs"
    >
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-textarea>
    <a-input-password
        ref="component"
        v-else-if="password"
        :allowClear="disabled || readonly ? false : true"
        class="flex1"
        :value="value"
        :placeholder="disabled || readonly ? '' : '请输入'"
        :class="{ pointer: pointer }"
        :disabled="!!disabled"
        :readonly="!!readonly"
        v-bind="$attrs"
    >
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-input-password>
    <a-input-number
        ref="component"
        v-else-if="number"
        :allowClear="disabled || readonly ? false : true"
        :class="{ pointer: pointer }"
        class="flex1"
        style="width: 100%"
        :value="value"
        :placeholder="disabled || readonly ? '' : '请输入'"
        :disabled="!!disabled"
        :readonly="!!readonly"
        v-bind="$attrs"
    >
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-input-number>
    <a-input
        ref="component"
        v-else
        :allowClear="disabled || readonly ? false : true"
        class="flex1"
        :value="value"
        :placeholder="disabled || readonly ? '' : '请输入'"
        :class="{ pointer: pointer }"
        :disabled="!!disabled"
        :readonly="!!readonly"
        v-bind="$attrs"
    >
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-input>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormInput'
}
</script>

<style lang="scss" scoped>
.pointer {
    :deep(input) {
        cursor: pointer !important;
    }
}
</style>
