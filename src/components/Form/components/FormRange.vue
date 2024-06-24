<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { thousandthDot } from '@/utils'

defineProps(['itemAfter', 'itemBefore', 'text', 'value'])

const dates = ref([])

const disabledDate = (current) => {
    current = dayjs(current)
    if (!dates.value || dates.value.length === 0) {
        return false
    }
    const diffDate = current.diff(dates.value[0], 'days')
    return Math.abs(diffDate) > 30
}

const onOpenChange = (open) => {
    if (open) {
        dates.value = []
    }
}

const onCalendarChange = (val) => {
    dates.value = val
}
</script>

<template>
    <span v-if="itemBefore" class="__form_item_before">{{ itemBefore }}</span>
    <template v-if="$slots.text">
        <component :is="$slots.text" v-bind="$attrs" />
    </template>
    <span v-else-if="text" class="__form_item_text" v-bind="$attrs">{{
        thousandthDot(((typeof text === 'boolean' ? false : text) || (value === undefined ? '' : value).toString() || '-').toString())
    }}</span>
    <a-range-picker
        v-else
        format="YYYY-MM-DD"
        @openChange="onOpenChange"
        @calendarChange="onCalendarChange"
        :disabledDate="disabledDate"
        :valueFormat="$attrs.format ? $attrs.format : 'YYYY-MM-DD'"
        :allowClear="false"
        style="width: 100%"
        :ranges="{ 最近7天: [dayjs().subtract(7, 'days'), dayjs()], 最近30天: [dayjs().subtract(30, 'days'), dayjs()] }"
        :value="value"
        :placeholder="['请选择', '请选择']"
        separator="～"
        v-bind="$attrs"
    >
        <template #suffixIcon>
            <img src="@/assets/components/date.png" style="top: 50%; right: 3px; width: 24px; height: 24px; position: absolute; transform: translateY(-50%)" />
        </template>
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-range-picker>
    <span v-if="itemAfter" class="__form_item_after">{{ itemAfter }}</span>
</template>

<script>
export default {
    name: 'FormRange'
}
</script>
