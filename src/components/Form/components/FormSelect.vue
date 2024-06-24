<script setup>
import { useSlots } from 'vue'
import { thousandthDot } from '@/utils'

defineProps(['value', 'itemAfter', 'itemBefore', 'text'])

const slots = useSlots()
const slotsNames = Object.entries(slots)
    .filter((e) => e[0] !== 'default')
    .map((e) => ({ name: e[0], slot: e[1] }))
const slotsDefauut = slots.default ? slots.default() : []
</script>

<template>
    <span v-if="itemBefore" class="__form_item_before">{{ itemBefore }}</span>
    <template v-if="$slots.text">
        <component :is="$slots.text" v-bind="$attrs" />
    </template>
    <span v-else-if="text" class="__form_item_text" v-bind="$attrs">{{
        thousandthDot(((typeof text === 'boolean' ? false : text) || (value === undefined ? '' : value).toString() || '-').toString())
    }}</span>
    <a-select v-else class="flex1" :value="value" placeholder="请选择" v-bind="$attrs">
        <template v-for="(item, index) in slotsNames" :key="index" #[item.name]>
            <component :is="item.slot" />
        </template>
        <template v-for="(item, index) in slotsDefauut" :key="index">
            <component :is="item" />
        </template>
    </a-select>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormSelect'
}
</script>
