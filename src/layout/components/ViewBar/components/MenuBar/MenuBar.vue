<script setup>
import Store from '@/store'
import Router from '@/router'
import { useRoute } from 'vue-router'
import MenuItem from './components/MenuItem.vue'
</script>

<template>
    <div class="menu_bar w100">
        <a-menu :selectedKeys="[useRoute().path]" mode="horizontal" @select="({ key }) => Router.replace(key)">
            <template v-for="item in Store.state.auth.menus" :key="item.url">
                <template v-if="item.children && item.children.length">
                    <MenuItem :menu="item" />
                </template>
                <template v-else>
                    <a-menu-item :key="item.url"> {{ item.url.split('/').at(-1) }} </a-menu-item>
                </template>
            </template>
        </a-menu>
    </div>
</template>

<style lang="scss" scoped>
.menu_bar {
    height: 40px;
    :deep(ul) {
        color: #aba8b4;
        font-size: 14px;
        font-weight: 500;
        line-height: 40px !important;
        .ant-menu-submenu {
            &::after {
                left: 50%;
                width: 24px;
                bottom: 6px;
                height: 2px;
                border-radius: 1.5px;
                border-color: #fff;
                transform: translateX(-50%);
            }
        }
        .ant-menu-submenu-open,
        .ant-menu-submenu-active,
        .ant-menu-submenu-selected,
        .ant-menu-submenu:hover {
            color: #0194fe;
            &::after {
                border-color: #0194fe;
            }
        }
    }
}
</style>
