<template>
    <div class="ebook">
        <div class="read-wrapper">
            <div id="read"></div>
            <div class="mask">
                <div class="left" @click="prevPage"></div>
                <div class="center" @click="toggleTitleAndMenu"></div>
                <div class="right" @click="nextPage"></div>
            </div>
        </div>
        <transition name="fade-down">
            <div class="title-wrapper" v-show="MenuShowFlag">
                <div class="back-icon icon">&#xe7ed;</div>
                <div class="right">
                    <div class="bookmark-icon icon">&#xe610;</div>
                    <div class="search-icon icon">&#xe607;</div>
                </div>
            </div>
        </transition>
        <transition name="fade-up">
            <div class="menu-wrapper" v-show="MenuShowFlag">
                <div class="catalog-icon icon">&#xe890;
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
        </transition>
        <transition name="slide">
            <div class="setting-containter" v-show="SettingFlag">
                <div class="background-color settings">背景</div>
                <div class="intensity-control settings">亮度</div>
                <div class="font-size settings">字体
                    <button>A-</button>
                    <button>A+</button>
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
import { ref } from 'vue';
import { onMounted } from 'vue';
import Epub from 'epubjs'

let rendition=''
const DOWNLOAD_URL='/01.epub'
let MenuShowFlag=ref(false)
let SettingFlag=ref(true)

const showEpub=()=>{
    let book=Epub(DOWNLOAD_URL)

    rendition=book.renderTo('read',{
        width:window.innerWidth,
        height:window.innerHeight
    })
    rendition.display()
}
const prevPage=()=>{
    if (SettingFlag.value!=true) {
        rendition.prev()
    }else{
        SettingFlag.value=false
    }
}
const nextPage=()=>{
    if (SettingFlag.value!=true) {
        rendition.next()
    }else{
        SettingFlag.value=false
    }
}

const toggleTitleAndMenu=()=>{
    if (SettingFlag.value!=true) {
        MenuShowFlag.value=!MenuShowFlag.value
    }else{
        SettingFlag.value=false
    }
}

const settingsChange=()=>{
    if (SettingFlag.value==false) {
        SettingFlag.value=!SettingFlag.value
        MenuShowFlag.value=false
    }
}
onMounted(()=>{
    showEpub()
})
</script>

<style lang="less" scoped>
.ebook{
    position: relative;
    .read-wrapper{
        position: relative;
        .mask{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            display: flex;
            width: 100%;
            height: 100%;
            .left{
                flex: 0 0 100px;
            }
            .center{
                flex: 1;
            }
            .right{
                flex: 0 0 100px;
            }
        }
    }
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
            }
            .search-icon{
                width: 40px;
                height: 100%;
                font-size: 28px;
                padding-top: 3px;
            }
        }
    }
    .menu-wrapper{
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 101;
        display: flex;
        width: 100%;
        height: 80px;
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
    .setting-containter{
        width: 100%;
        height: 336px;
        // background-color: aqua;
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
}

</style>
