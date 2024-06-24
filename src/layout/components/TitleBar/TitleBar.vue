<script setup>
import TitleBarLeft from './components/TitleBarLeft/TitleBarLeft.vue'
import TitleBarRight from './components/TitleBarRight/TitleBarRight.vue'
</script>

<template>
    <div class="w100" style="height: 40px">
        <div class="title_bar flex flex_sb">
            <TitleBarLeft />
            <TitleBarRight />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.title_bar {
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    position: fixed;
    padding: 0 20px;
    background: #fff;
    user-select: none;
    box-sizing: border-box;
    z-index: 99999999999999999999;
    box-shadow: 0 2px 4px 0 rgba(108, 137, 137, 0.12);
}
</style>
