<script setup>
import Store from '@/store'
import TabBar from './components/TabBar/TabBar.vue'
import MenuBar from './components/MenuBar/MenuBar.vue'
</script>

<template>
    <div class="viewBar h100 flexc">
        <MenuBar />
        <div class="w100 flex1 flexc" style="background: #eaedef; box-sizing: border-box">
            <TabBar />
            <div class="w100 flex1 flexc" style="position: relative; background: #f8fafa">
                <div class="w100 h100" style="position: absolute; top: 0; left: 0; box-sizing: border-box; padding: 10px; overflow: hidden">
                    <RouterView v-slot="{ Component }">
                        <transition name="view" mode="out-in" @after-leave="Store.commit('app/PAGE_ANIMATION_END')">
                            <keep-alive :include="Store.state.tab">
                                <component :is="Component" />
                            </keep-alive>
                        </transition>
                    </RouterView>
                </div>
            </div>
        </div>
    </div>
</template>
