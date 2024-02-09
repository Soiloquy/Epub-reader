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
        <BottomNav @settingsChange="settingsChange"
                    :MenuShowFlag="MenuShowFlag"
                    @onProgressChange="onProgressChange"></BottomNav>
        <Setting :SettingFlag="SettingFlag"
                 @fontSizeDown="fontSizeDown"
                 @fontSizeUp="fontSizeUp"
                 :themeList="themeList"
                 :defaultTheme="defaultTheme"
                 @setTheme="setTheme"></Setting>
    </div>
    <Catalog @jumpTo="jumpTo"
    :bookAvailable="bookAvailable"></Catalog>
</template>

<script setup>
import { ref,reactive,onBeforeMount,onMounted } from 'vue';
import Epub from 'epubjs'
import mitter from '@/plugins/Bus';
import Setting from '../../components/Setting.vue'
import BottomNav from './bottomNav/bottom-nav.vue'
import Catalog from './bottomNav/components/catalog.vue'

let rendition
let themes
const DOWNLOAD_URL='/01.epub'
let MenuShowFlag=ref(false)
let SettingFlag=ref(false)
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
const themeList=([
    {
        name:'white',
        style:{
            body:{
                'color':'#000',
                'background':'#fff!important'
            }
        }
    },
    {
        name:'eye',
        style:{
            body:{
                'color':'#5b4636',
                'background':'#f4ecd8!important'
            }
        }
    },
    {
        name:'cyan',
        style:{
            body:{
                'color':'#333333',
                'background':'#ceeaba!important'
            }
        }
    },
    {
        name:'gray',
        style:{
            body:{
                'color':'#9d9fa3',
                'background':'#45484a!important'
            }
        }
    },
    {
        name:'night',
        style:{
            body:{
                'color':'#b5aca2',
                'background':'#333333!important',
            }
        }
    },
])
let defaultTheme=ref(0)
let locations=''
let bookAvailable=ref(false)

// 根据链接跳转到指定位置
const jumpTo=(href)=>{
    rendition.display(href)
}

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
        themes.fontSize(FontSize[fontSizeIndex].fontSize+'px')
    }
}
const setTheme=(index)=>{
    defaultTheme.value=index
    themes.select(themeList[index].name)
}
const registerTheme=()=>{
    themeList.forEach(theme=>{
        themes.register(theme.name,theme.style)
    })
}

// progress进度条的数值(0-100)
const onProgressChange=(progress)=>{
    const percentage=progress/100
    const location=percentage>0?locations.cfiFromPercentage(percentage):0
    rendition.display(location)
    console.log(locations.currentLocation,locations.length());
}

const showEpub=()=>{
    // 生成book对象
    let book=Epub(DOWNLOAD_URL)
    // 通过book.renderTo()生成rendition对象
    rendition=book.renderTo('read',{
        width:window.innerWidth,
        height:window.innerHeight
    })
    // 通过Rendition.display()渲染电子书
    rendition.display()
    // 获取Theme对象
    themes=rendition.themes
    // 设置默认字体大小
    themes.fontSize(defaultFontSize+'px')
    // themes.register注册主题
    registerTheme()
    // 设置默认主题
    setTheme(defaultTheme.value)
    // 获取Locations对象
    // 通过epubjs的钩子函数来实现
    // book.ready 电子书解析完成时执行的回调
    book.ready.then(()=>{
        mitter.emit('navigation',book)
        return book.locations.generate()
    }).then(result=>{
        locations=book.locations
        onProgressChange(10)
        bookAvailable.value=true
        console.log(book);
    })
}

const judgeSettingFlag=()=>{
    if (SettingFlag.value!=true&&MenuShowFlag.value!=true) {
        return false
    }else if(MenuShowFlag.value==true){
        MenuShowFlag.value=false
    }else{
        SettingFlag.value=false
    }
    return true
}
const prevPage=()=>{
    if (!judgeSettingFlag()) {
        rendition.prev()
    }
}
const nextPage=()=>{
    if (!judgeSettingFlag()) {
        rendition.next()
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

onBeforeMount(()=>{
    showEpub()
    mitter.on('menuBarChange',e=>{
        MenuShowFlag.value=e
    })
})

onMounted(()=>{
    
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
}
</style>
