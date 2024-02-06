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
        <Setting :SettingFlag="SettingFlag"
        @fontSizeDown="fontSizeDown"
        @fontSizeUp="fontSizeUp"></Setting>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import { onMounted } from 'vue';
import Epub from 'epubjs'
import Setting from '../../components/Setting.vue'

let rendition=''
const DOWNLOAD_URL='/01.epub'
let MenuShowFlag=ref(false)
let SettingFlag=ref(true)
const defaultFontSize=18
let fontSizeIndex=3
const FontSize=reactive([
    {fontSize:12},
    {fontSize:14},
    {fontSize:16},
    {fontSize:18},
    {fontSize:20},
    {fontSize:22},
    {fontSize:24},
])
let themes

const fontSizeDown=()=>{
    if (fontSizeIndex<=0) {
        console.log('最小了');
        return
    }else{
        fontSizeIndex--
        console.log(FontSize[fontSizeIndex].fontSize,fontSizeIndex);
        themes.fontSize(FontSize[fontSizeIndex].fontSize+'px')
    }
}
const fontSizeUp=()=>{
    if (fontSizeIndex>=6) {
        console.log('最大了');
        return
    }else{
        fontSizeIndex++
        console.log(FontSize[fontSizeIndex].fontSize,fontSizeIndex);
        themes.fontSize(FontSize[fontSizeIndex].fontSize+'px')
    }
}
const showEpub=()=>{
    let book=Epub(DOWNLOAD_URL)

    rendition=book.renderTo('read',{
        width:window.innerWidth,
        height:window.innerHeight
    })
    rendition.display()
    themes=rendition.themes
    themes.fontSize(defaultFontSize+'px')
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
}

</style>
