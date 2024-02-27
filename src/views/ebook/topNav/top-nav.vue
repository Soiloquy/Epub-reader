<template>
    <transition name="fade-down">
        <div class="title-wrapper" v-show="MenuShowFlag">
            <div class="back-icon icon">&#xe7ed;</div>
            <div class="right">
                <div class="bookmark-icon icon" @click="addBookmark" :class="{'active':bookMark==true}">&#xe610;</div>
                <div class="search-icon icon">&#xe607;</div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { defineProps,defineEmits,ref,watch,onBeforeMount, reactive } from 'vue';
import mitter from '@/plugins/Bus';
import store from '@/store';

let bookMark=ref(false)

const emit=defineEmits([])
const props=defineProps({
    MenuShowFlag:{type:Boolean,default:false},
})

const addBookmark=()=>{
    if (bookMark.value==false) {
        bookMark.value=true   
    }else{
        bookMark.value=false
    }
}
</script>

<style lang="less" scoped>
.title-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: 50px;
    background-color: #fff;
    color: #aaaaaa;
    box-shadow: 0 3px 3px rgba(0, 0, 0, .15);
    &.fade-down-enter-active,
    &.fade-down-leave-active {
        transition: opacity 0.3s ease;
    }

    &.fade-down-enter-from,
    &.fade-down-leave-to {
        opacity: 0;
    }
    .back-icon{
        flex: 1;
        height: 100%;
        font-size: 28px;
        line-height: 50px;
        margin-left: 8px;
    }
    .right{
        display: flex;
        .bookmark-icon{
            width: 40px;
            height: 100%;
            line-height: 50px;
            font-size: 26px;
            margin-right: 18px;
            &.active{
                color: rgb(255, 65, 65);
            }
        }
        .search-icon{
            width: 40px;
            height: 100%;
            font-size: 28px;
            padding-top: 3px;
        }
    }
}
</style>