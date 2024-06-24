<script setup>
import Store from '@/store'
import Router from '@/router'
import Sortable from 'sortablejs'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'

const Route = useRoute()

const activeKey = computed({
    get () {
        return Route.path
    },
    set (path) {
        Router.replace(path)
    }
})

onMounted(() => {
    Sortable.create(document.getElementsByClassName('ant-tabs-nav-list')[0])
})
</script>

<template>
    <div class="tab_bar w100">
        <a-tabs
            v-model:activeKey="activeKey"
            hideAdd
            size="small"
            type="editable-card"
            @edit="path => Store.commit('tab/DEL_TAB', { path })"
        >
            <a-tab-pane v-for="item in Store.state.tab" :key="item" :tab="item.split('/').at(-1)" />
            <template #rightExtra>
                <a-dropdown>
                    <a-button>
                        <template #icon><DownOutlined /></template>
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="Store.commit('tab/REFRESH', { path: activeKey })">刷新</a-menu-item>
                            <a-menu-item @click="Store.commit('tab/DEL_TAB', { path: activeKey })">关闭</a-menu-item>
                            <a-menu-item @click="Store.commit('tab/DEL_OTHER')">关闭其他 </a-menu-item>
                            <a-menu-item @click="Store.commit('tab/DEL_ALL')">关闭全部</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </template>
        </a-tabs>
    </div>
</template>

<style lang="scss" scoped>
.tab_bar {
    :deep(.ant-tabs-bar) {
        margin-bottom: 0 !important;
    }
    :deep(.ant-tabs) {
        height: 32px;
        .ant-tabs-extra-content {
            line-height: 1 !important;
        }
        .ant-tabs-nav-list {
            height: 32px;
            .ant-tabs-tab {
                color: #aba8b4;
                height: 33px;
                border-left: none;
                background: #fff;
                line-height: 32px;
                padding-right: 22px;
                border-top-left-radius: 8px;
                clip-path: polygon(85% 0, 100% 100%, 0 100%, 0 0);
                &:not(:first-child) {
                    margin-left: -6px;
                }
            }
            .ant-tabs-tab-active {
                z-index: 1;
                background-color: #0194fe;
                div,
                button {
                    color: #fff;
                }
            }
        }
    }
}
</style>
