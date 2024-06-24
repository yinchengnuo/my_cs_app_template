<script setup>
import Store from '@/store'
import TitleBar from './components/TitleBar/TitleBar.vue'
</script>

<template>
    <div class="layout h100 oh flexc">
        <TitleBar />
        <div class="w100 flex1" style="position: relative">
            <div v-if="Store.state.app.loading.size" class="loading flex" @click.stop="() => {}">
                <a-spin size="large" />
            </div>
            <a-watermark class="h100" :content="`${Store.state.userinfo.all?.account ?? ''} ${Store.state.userinfo.all?.nickName ?? ''} ${Store.state.userinfo.facName}`">
                <RouterView />
            </a-watermark>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.loading {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 999999999;
    background: rgba(255, 255, 255, 0.5);
}
.code {
    left: -4px;
    bottom: 0;
    color: #fff;
    height: 20px;
    width: 40vw;
    overflow: auto;
    font-size: 14px;
    position: fixed;
    line-height: 20px;
    padding-left: 4px;
    border-radius: 4px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.4);
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
