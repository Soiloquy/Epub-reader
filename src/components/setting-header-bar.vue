<template>
    <div class="header">
        <div class="fixed-box">
            <div class="icon close" @click="closeSettingHeaderBar">&#xe64a;</div>
            <div class="title">{{ title }}</div>
        </div>
    </div>
</template>

<script setup>
import {ref,defineEmits} from 'vue'

const emit=defineEmits(['closeSettingHeaderBar'])
const props=defineProps({
    title:{type:String,default:''}
})

const closeSettingHeaderBar=()=>{
    emit('closeSettingHeaderBar')
}
</script>

<style lang="less" scoped>
.header{
    width: 100%;
    height: 55px;
    .fixed-box{
        position: fixed;
        display: flex;
        top: 0;
        left: 0;
        width: 100%;
        height: 55px;
        align-items: center;
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;
        box-shadow: 0px 2px 5px 2px #e6e6e6;
        z-index: 201;
        .title{
            height: 100%;
            flex: 1;
            font-size: 26px;
            text-align: center;
            padding-right: 32px;
            line-height: 55px;
            color: rgb(0, 0, 0);
        }
        .close{
            height: 100%;
            width: 32px;
            line-height: 55px;
            font-size: 32px;
        }
    }
}
</style>