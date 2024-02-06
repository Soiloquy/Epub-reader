<template>
    <div>
        <transition name="slide">
            <div class="setting-containter" v-show="SettingFlag">
                <div class="background-color settings">背景</div>
                <div class="intensity-control settings">亮度</div>
                <div class="font-size settings">字体
                    <button @click="fontSizeDown">A-</button>
                    <button @click="fontSizeUp">A+</button>
                </div>
                <div class="interval settings">间距</div>
                <!-- <div class="font-family">字体</div> -->
                <div class="paging settings">翻页</div>
                <div class="more-setting settings">更多设置</div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { defineProps,defineEmits } from 'vue';


const emit=defineEmits(['fontSizeDown','fontSizeUp'])

const props=defineProps({
    SettingFlag:{type:Boolean,default:false}
})

const fontSizeDown=()=>{
    emit('fontSizeDown')
}
const fontSizeUp=()=>{
    emit('fontSizeUp')
}
</script>

<style lang="less" scoped>
.setting-containter{
        width: 100%;
        height: 336px;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 101;
        font-size: 18px;
        box-shadow: 0 -3px 3px rgba(0, 0, 0, .1);
        &.slide-enter-active,
        &.slide-leave-active {
            transition: all 0.1s linear;
        }
        &.slide-enter-from,
        &.slide-leave-to {
            transform: translateY(100%);
        }
        &.slide-enter-to,
        &.slide-leave-from {
            transform: translateY(0%);
        }
        .settings{
            width: 85%;
            height: 56px;
            margin: 0 auto;
            line-height: 56px;
            border-bottom: 1px solid #d4d4d4;
        }
        .font-size{
            display: flex;
            align-items: center;
            button{
                display: block;
                width: 100px;
                height: 30px;
                font-size: 16px;
                border-radius: 20px;
                margin-left: 22px;
                border: 1px solid #1d1d1d;
                background-color: #fff;
            }
        }
    }
</style>