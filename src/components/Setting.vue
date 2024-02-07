<template>
    <div>
        <transition name="slide">
            <div class="setting-containter" v-show="SettingFlag">
                <div class="background-color settings">
                    <div class="background-color-item" v-for="(item,index) in themeList.slice(0,4)" :key="index">
                        <div class="bkc" :style="{background:item.style.body.background}"
                        :class="{'select':index===thisDefaultTheme}" @click="setTheme(index)"></div>
                    </div>
                    <div class="bkc night icon" :class="{'select':thisDefaultTheme===4}" @click="setTheme(4)">&#xe608;</div>
                </div>
                <div class="intensity-control settings">亮度</div>
                <div class="font-size settings">字体
                    <button @click="fontSizeDown">A-</button>
                    <button @click="fontSizeUp">A+</button>
                </div>
                <div class="interval settings">间距</div>
                <div class="paging settings">翻页</div>
                <div class="more-setting settings">更多设置</div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { defineProps,defineEmits,watch,ref } from 'vue';


const emit=defineEmits(['fontSizeDown','fontSizeUp','setTheme'])
const props=defineProps({
    SettingFlag:{type:Boolean,default:false},
    themeList:{type:Array,default:[]},
    defaultTheme:{type:Number,default:0}
})
let thisDefaultTheme=ref(props.defaultTheme)
const fontSizeDown=()=>{
    emit('fontSizeDown')
}
const fontSizeUp=()=>{
    emit('fontSizeUp')
}
const setTheme=(index)=>{
    emit('setTheme',index)
}
watch(()=>props.defaultTheme,(newVal)=>{
    thisDefaultTheme.value=newVal
})
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
        .background-color{
            display: flex;
            justify-content: center;
            align-items: center;
            .bkc{
                width: 40px;
                height: 40px;
                margin:0 7px 0 7px;
                border-radius: 50%;
                border: 1px solid #ccc;
                &.select{
                    border: 2px solid#3ca4fa;
                }
                
            }
            .night{
                color: #8c8a8b;
                line-height: 40px;
                text-align: center;
                font-size: 25px;
                background-color: #333333;
            }
        }
    }
</style>