<script setup>
import Store from '@/store'
</script>

<template>
    <div class="title_bat_left h100 flex flex_fs">
        <img src="@/assets/login/logo.png" width="64" style="object-fit: cover; margin-right: 14px" />
        <span style="font-weight: 500; font-size: 14px; color: #565169; letter-spacing: 1px; margin-right: 14px">
            <span style="color: red; font-weight: bolder;">{{ Store.state.env.env.name }}</span>
            <span>{{ Store.state.app.appName }}</span>
        </span>
        <a-breadcrumb v-if="$route.path.replace('/', '').split('/').length > 1" style="font-size: 12px">
            <a-breadcrumb-item v-for="item in $route.path.replace('/', '').split('/')" :key="item">{{ item }}</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>

<style lang="scss" scoped></style>
