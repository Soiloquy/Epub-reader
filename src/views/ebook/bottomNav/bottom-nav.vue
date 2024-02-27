<template>
    <div>
        <transition name="fade-up">
            <div class="menu-wrapper" v-show="MenuShowFlag">
                <transition name="show">
                    <div class="section-now-wrapper" v-show="bubbleFlag">
                        <div class="left">
                            <div class="section-now">{{ sectionName }}</div>
                            <div class="pro-pre">{{ progress }}%</div>
                        </div>
                        <div class="right icon" @click="backSection">&#xe649;</div>
                    </div>
                </transition>
                <div class="progress-bar">
                    <div class="left icon" @click="prevSection">&#xe628;</div>
                        <input class="progress" type="range"
                               max="100" min="0" step="1"
                               :value="progress"
                               @input="onProgressInput(progressEle.value)"
                               @touchstart="bubbleShow" @touchend="bubbleDisappear"
                               ref="progressEle"
                        >
                    <div class="right icon" @click="nextSection">&#xe642;</div>
                </div>
                <div class="items">
                    <div class="catalog-icon icon"  @click="openCatalog">&#xe890;
                        <div class="word">目录</div>
                    </div>
                    <div class="note-icon icon">&#xe77f;
                        <div class="word">笔记</div>
                    </div>
                    <div class="all-bookmark-icon icon">&#xe7b5;
                        <div class="word">书签</div>
                    </div>
                    <div class="setting-icon icon" @click="settingsChange">&#xe601;
                        <div class="word">设置</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { defineProps,defineEmits,ref,watch,onBeforeMount, reactive } from 'vue';
import mitter from '@/plugins/Bus';
import store from '@/store';
let progressEle=ref()
let progress=ref(10)
// 控制显示当前阅读进度的气泡框
let bubbleFlag=ref(false)
let navigation=reactive({})
let locations=reactive({})

const emit=defineEmits(['settingsChange','onProgressInput','update:progress','getSection','jumpTo'])
const props=defineProps({
    MenuShowFlag:{type:Boolean,default:false},
    sectionName:{type:String,default:''},
    inputProgress:{type:Number,default:0}
})


const settingsChange=()=>{
    emit('settingsChange')
}

let timerOfInput=null
const onProgressInput=(e)=> {
    progress.value=e
    const location=e>0?locations.cfiFromPercentage(e/100):0
    emit('getSection',location)
    // 防抖
    if (timerOfInput) {
        clearTimeout(timerOfInput)
    }
    timerOfInput=setTimeout(()=>{
        emit('onProgressInput',e)
    },200)
}

const openCatalog=()=>{
    mitter.emit('openCatalog',true)
    mitter.emit('menuBarChange',false)
}

let tmpSec=0
const bubbleShow=()=>{
    clearInterval(timer)
    tmpSec=progress.value
    if (!bubbleFlag.value) {
        bubbleFlag.value=true
    }
}

let timer=null
const bubbleDisappear=()=>{
    clearInterval(timer)
    timer=setTimeout(()=>{
        bubbleFlag.value=false
    },3000)
}

const backSection=()=>{
    progress.value=tmpSec
    onProgressInput(progress.value)
    clearInterval(timer)
    bubbleDisappear()
}


watch(()=>props.MenuShowFlag,(newMenuShowFlag)=>{
    // 每次呼出导航栏 修改阅读进度条的值和存储当前阅读页面的epubcfi
    if (newMenuShowFlag) {
        clearInterval(timer)
        progress.value=Math.round(store.state.nowPagePercentage*100)
        emit('getSection',store.state.nowPageEpubCFI)
    }
    bubbleFlag.value=false
})
watch(()=>props.inputProgress,(newInputProgress)=>{
    progress.value=newInputProgress
    console.log(newInputProgress);
})
const prevSection=()=>{
    for (let i = 0; i < navigation.toc.length; i++) {
        const item = navigation.toc[i];
        if (item.label.trim()==props.sectionName&&i!=0) {
            const href=navigation.toc[i-1].href
            console.log(href,i,item,navigation.toc);
            emit('jumpTo',href,navigation.toc[i-1].label)
            break
        }else if(item.label.trim()==props.sectionName&&i===0){
            emit('jumpTo',0,'封面')
            progress.value=0
        }
    }
}

const nextSection=()=>{
    if (props.sectionName=='封面') {
        emit('jumpTo',navigation.toc[0].href,navigation.toc[0].label)
    }
    for (let i = 0; i < navigation.toc.length-1; i++) {
        const item = navigation.toc[i];
        if (item.label.trim()==props.sectionName) {
            const href=navigation.toc[i+1].href
            emit('jumpTo',href,navigation.toc[i+1].label)
            break
        }
    }
}

onBeforeMount(()=>{
    mitter.on('navigation',e=>{
        navigation=e
    })
    mitter.on('locations',value=>{
        locations=value
    })  
})
</script>

<style lang="less" scoped>
.menu-wrapper{
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 101;
        width: 100%;
        height: 140px;
        background-color: #fff;
        color: #aaaaaa;
        box-shadow: 0 -3px 3px rgba(0, 0, 0, .1);
        &.fade-up-enter-active,
        &.fade-up-leave-active {
        transition: opacity 0.3s ease;
        }

        &.fade-up-enter-from,
        &.fade-up-leave-to {
        opacity: 0;
        }
        .section-now-wrapper{
            position: absolute;
            display: flex;
            width: 200px;
            height: 66px;
            background-color: black;
            align-items: center;
            top: -90px;
            left: 80px;
            border-radius: 33px;
            &.show-enter-active,
            &.show-leave-active {
            transition: opacity 0.5s ease;
            }

            &.show-enter-from,
            &.show-leave-to {
            opacity: 0;
            }
            .left{
                margin-left: 30px;
                font-size: 22px;
                flex: 1;
                .section-now{
                    height: 33px;
                    line-height: 33px;
                    word-break: break-all;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            }
            .right{
                flex: .3;
                color: #f5f5f5;
                font-size: 40px;
                margin-right: 10px;
                border-left: 1px solid #565656;
            }
        }
        .progress-bar{
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            .progress {
                width: 260px;
				height:2px;
                margin-top: 5px;
				background:-webkit-linear-gradient(#999,#999) no-repeat #ddd;
				background-size:0 100%;
				&:focus {
					outline:none;
				}
				&::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #fff;
                    border: 1px solid #ddd;
                    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
				}
			}
        }
        .items{
            display: flex;
            height: 80px;
            width: 100%;
        }
        .icon{
            flex: 1;
            text-align: center;
            padding-top: 5px;
        }
        .word{
            font-size: 18px;
            color: #646464;
        }
}

</style>