<script setup>
    import Head from '@/components/Head.vue'
    import Sider from '@/components/Sider/Sider.vue'
    import Main from '@/components/Main.vue'
    import Tabs from '@/components/Tabs.vue'
    import Notification from '@/components/Notification.vue'
    import { useMaskStore } from '@/store';

    const maskStore = useMaskStore()
</script>

<template>
    <Head></Head>
    <div class="main">
        <Sider></Sider>
        <div class="rightWrapper">
            <Tabs></Tabs>
            <Main></Main>
        </div>
    </div>

    <Notification></Notification>
    <div v-if="maskStore.show" @click="maskStore.onHide()" @contextmenu="maskStore.onHide()" class="mask"></div>
</template>

<style lang="less" scoped>
    .main{display:flex;
        .rightWrapper{flex:1;}
    }
    .mask{position:fixed;left:0;right:0;top:0;bottom:0;z-index:998}
</style>
