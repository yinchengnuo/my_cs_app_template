<script setup></script>

<template>
    <a-select-option class="flex1" v-bind="$attrs">
        <template v-for="(item, name, index) in $slots" :key="index">
            <component :is="item" />
        </template>
    </a-select-option>
</template>

<script>
export default {
    name: 'FormSelectItem'
}
</script>
