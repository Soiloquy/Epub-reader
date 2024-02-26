<template>
    <div v-show="catalogShow">
        <div class="content">
            <HeaderBar title="目录"
            @closeSettingHeaderBar="closeSettingHeaderBar"></HeaderBar>
            <div class="content-wrapper" v-if="bookAvailable">
                <div class="content-item" v-for="(item,index) in navigation.toc" 
                :key="index" @click="jumpTo(item.href,item.label)">
                    <span class="text">{{ item.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeaderBar from '../../../../components/setting-header-bar.vue'
import { ref,onBeforeMount,defineEmits,defineProps } from 'vue';
import mitter from '@/plugins/Bus';

let catalogShow=ref(false)
let navigation=ref({})

const emit=defineEmits(['jumpTo'])
const props=defineProps({
    bookAvailable:{type:Boolean,default:false}
})

const closeSettingHeaderBar=()=>{
    catalogShow.value=false
}
const jumpTo=(href,label)=>{
    catalogShow.value=false
    emit('jumpTo',href,label)
}
 
onBeforeMount(()=>{
    mitter.on('openCatalog',e=>{
        catalogShow.value=e
    })
    mitter.on('navigation',e=>{
        navigation.value=e
    })
})
</script>

<style lang="less" scoped>
.content{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 200;
    .content-item{
        width: 90%;
        height: 50px;
        margin: 0 auto;
        line-height: 50px;
        font-size: 24px;
        border-bottom: 1px solid #ececec;
        background-color: #fff;
    }
}
</style>