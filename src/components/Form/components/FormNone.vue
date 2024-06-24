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
    <template v-else-if="$slots.default">
        <slot />
    </template>
    <div v-else class="flex1" v-bind="$attrs">{{ thousandthDot((value || (typeof text === 'boolean' ? false : text) || '').toString()) }}</div>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormNone'
}
</script>
