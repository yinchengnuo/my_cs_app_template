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
    <a-time-picker v-else valueFormat="HH:mm:ss" v-bind="$attrs" :value="value" placeholder="请选择" class="flex1">
        <template #suffixIcon>
            <img src="@/assets/components/date.png" style="top: 50%; right: 3px; width: 24px; height: 24px; position: absolute; transform: translateY(-50%)" />
        </template>
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-time-picker>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormTime'
}
</script>
