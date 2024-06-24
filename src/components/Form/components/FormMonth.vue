<script setup>
import { thousandthDot } from '@/utils'

defineProps(['value', 'itemAfter', 'itemBefore', 'text'])
</script>

<template>
    <span v-if="itemBefore" class="__form_item_before">{{ itemBefore }}</span>
    <template v-if="$slots.text">
        <component :is="$slots.text" v-bind="$attrs" />
    </template>
    <span v-else-if="text" class="__form_item_text" v-bind="$attrs">{{
        thousandthDot(((typeof text === 'boolean' ? false : text) || (value === undefined ? '' : value).toString() || '-').toString())
    }}</span>
    <a-month-picker v-else valueFormat="YYYY-MM" class="flex1" :value="value" placeholder="请选择" v-bind="$attrs">
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-month-picker>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormMonth'
}
</script>
