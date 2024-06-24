<script setup>
import { thousandthDot } from '@/utils'

defineProps(['value', 'itemAfter', 'itemBefore', 'text', 'button', 'options'])
</script>

<template>
    <span v-if="itemBefore" class="__form_item_before">{{ itemBefore }}</span>
    <template v-if="$slots.text">
        <component :is="$slots.text" v-bind="$attrs" />
    </template>
    <span v-else-if="text" class="__form_item_text" v-bind="$attrs">{{
        thousandthDot(((typeof text === 'boolean' ? false : text) || (value === undefined ? '' : value).toString() || '-').toString())
    }}</span>
    <a-radio-group v-else class="flex1" :value="value" v-bind="$attrs">
        <template v-for="(item, index) in options || []" :key="index">
            <a-radio-button v-if="button" :value="item.value">{{ item.label }}</a-radio-button>
            <a-radio v-else :value="item.value">{{ item.label }}</a-radio>
        </template>
    </a-radio-group>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormRadio'
}
</script>
