<script setup>
import Router from '@/router';
import { useRoute } from 'vue-router'

Router.replace(`${useRoute().query.path}`)
</script>

<template><div></div></template>
