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
                    <div class="bookmark-icon icon" @click="addBookmark" :class="{'active':bookMark==true}">&#xe610;</div>
                    <div class="search-icon icon">&#xe607;</div>
                </div>
            </div>
        </transition>
        <BottomNav @settingsChange="settingsChange"
                    :MenuShowFlag="MenuShowFlag"
                    :sectionName="sectionName"
                    :inputProgress="inputProgress"
                    @onProgressInput="onProgressInput"
                    @getSection="getSection"
                    @jumpTo="jumpTo"></BottomNav>
        <Setting :SettingFlag="SettingFlag"
                 @fontSizeDown="fontSizeDown"
                 @fontSizeUp="fontSizeUp"
                 :themeList="themeList"
                 :defaultTheme="defaultTheme"
                 @setTheme="setTheme"
                 ></Setting>
    </div>
    <Catalog @jumpTo="jumpTo"
    :bookAvailable="bookAvailable"></Catalog>
    <Toast ref="toast"></Toast>
</template>

<script setup>
import { ref,reactive,onBeforeMount} from 'vue';
import Epub from 'epubjs'
import mitter from '@/plugins/Bus';
import Setting from '../../components/Setting.vue'
import BottomNav from './bottomNav/bottom-nav.vue'
import Catalog from './bottomNav/components/catalog.vue'
import Toast from '../../utils/toast.vue'
import { useStore } from 'vuex';

let rendition
let themes
const DOWNLOAD_URL='/01.epub'
// 控制上下菜单栏
let MenuShowFlag=ref(false)
// 控制设置菜单栏
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
let toast=ref()
let spineItems=reactive([])
let navigationToc=reactive([])
let sectionName=ref('')
let bookMark=ref(true)
const store=useStore()
let inputProgress=ref()

// 根据链接跳转到指定位置
const jumpTo=(href,label)=>{
    rendition.display(href).then((e)=>{
        setTimeout(()=>{
            let start=rendition.location.start
            sectionName.value=label.trim()
            store.commit('getEpubCFIandPercentage',[start.cfi,start.percentage])
            inputProgress.value=Math.round(store.state.nowPagePercentage*100)
        },50)
    })
}

const fontSizeDown=()=>{
    if (fontSizeIndex<=0) {
        toast.value.showMessage('最小了')
        return
    }else{
        fontSizeIndex--
        themes.fontSize(FontSize[fontSizeIndex].fontSize+'px')
    }
}
const fontSizeUp=()=>{
    if (fontSizeIndex>=6) {
        toast.value.showMessage('最大了')
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

// 通过epubcfi获取当前的章节
const getSection=(location)=>{
    // 通过locations.spine.items返回包含cfiBase、href、idref、url的
    // 对象类型的数组的所有章节
    spineItems=locations.spine.items
    // 通过forEach遍历 item.cfiBase找到每个章节的cfiBase
    spineItems.forEach(item => {
        // 用includes来判断每一页对应哪个cfiBase
        if (location==0) {
            sectionName.value='封面'
        }else if (location.includes(item.cfiBase)) {
            // 遍历navigation.toc，通过href来找到每一页对应的章节
            for (let index = 0; index < navigationToc.length; index++) {
                const tocHref = navigationToc[index].href;
                if (tocHref.includes(item.href)) {
                    sectionName.value=navigationToc[index].label.trim()
                }
            }
        }
    });
}

// progress进度条的数值(0-100)
const onProgressInput=(progress)=>{
    const percentage=progress/100
    // 通过locations.cfiFromPercentage(percentage) 返回每一页的epubCFI
    const location=percentage>0?locations.cfiFromPercentage(percentage):0
    rendition.display(location)
    store.commit('getEpubCFIandPercentage',[location,percentage])
    // console.log(locations.locationFromCfi(location));
    getSection(location)
}

const showEpub=()=>{
    // 生成book对象
    let book=Epub(DOWNLOAD_URL)
    // 通过book.renderTo()生成rendition对象
    rendition=book.renderTo('read',{
        width:window.innerWidth,
        height:window.innerHeight,
        flow: "paginated",
        manager: "continuous",
        snap: true,
    })
    // 通过Rendition.display()渲染电子书
    rendition.display()
    // 获取Theme对象
    themes=rendition.themes
    // 设置默认字体大小
    themes.fontSize(defaultFontSize+'px')
    // themes.register注册主题
    registerTheme()
    console.log(book.spine);
    // 设置默认主题
    setTheme(defaultTheme.value)
    // 获取Locations对象
    // 通过epubjs的钩子函数来实现
    // book.ready 电子书解析完成时执行的回调
    book.ready.then(()=>{
        mitter.emit('navigation',book.navigation)
        return book.locations.generate()
    }).then(result=>{
        locations=book.locations
        mitter.emit('locations',locations)
        navigationToc=book.navigation.toc
        console.log(navigationToc);
        let localProgress=10
        onProgressInput(localProgress)
        bookAvailable.value=true
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
        let start=rendition.location.start
        store.commit('getEpubCFIandPercentage',[start.cfi,start.percentage])
    }
}
const nextPage=()=>{
    if (!judgeSettingFlag()) {
        rendition.next()
        let start=rendition.location.start
        store.commit('getEpubCFIandPercentage',[start.cfi,start.percentage])
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

const addBookmark=()=>{
    if (bookMark.value==false) {
        bookMark.value=true   
    }else{
        bookMark.value=false
    }
}
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
}
</style>
