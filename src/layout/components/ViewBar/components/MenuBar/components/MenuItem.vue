<script setup>
defineProps(['menu'])
</script>

<template>
    <a-sub-menu>
        <template #title>{{ menu.url.split('/').at(-1) }}</template>
        <template v-for="item in menu.children" :key="item.url">
            <template v-if="item.children && item.children.length">
                <MenuItem :menu="item" />
            </template>
            <template v-else>
                <a-menu-item :key="item.url">
                    {{ item.url.split('/').at(-1) }}
                </a-menu-item>
            </template>
        </template>
    </a-sub-menu>
</template>
