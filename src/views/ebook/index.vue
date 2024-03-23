<template>
    <div class="ebook">
        <div class="read-wrapper">
            <div id="read" v-if="ebookDestory"></div>
            <div class="mask" @touchstart="bookPagingStart" @touchend="bookPagingEnd">
                <div class="left"></div>
                <div class="center" @click="toggleTitleAndMenu"></div>
                <div class="right"></div>
            </div>
        </div>
        <TopNav :MenuShowFlag="MenuShowFlag"></TopNav>
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
import { ref,reactive,onBeforeMount,onBeforeUnmount,onMounted,onUnmounted} from 'vue';
import Epub from 'epubjs'
import mitter from '@/plugins/Bus';
import Setting from '../../components/Setting.vue'
import BottomNav from './bottomNav/bottom-nav.vue'
import Catalog from './bottomNav/components/catalog.vue'
import TopNav from './topNav/top-nav.vue';
import Toast from '../../utils/toast.vue'
import { useStore } from 'vuex';

let ebookDestory=ref(true)
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
                'background':'#fff!important',
            },
            ".bodycontent":{
                "line-height": "1.4"
            }
        }
    },
    {
        name:'eye',
        style:{
            body:{
                'color':'#5b4636',
                'background':'#f4ecd8!important',
                "line-height": "36px"
            },
            ".bodycontent":{
                "line-height": "1.4"
            }
        }
    },
    {
        name:'cyan',
        style:{
            body:{
                'color':'#333333',
                'background':'#ceeaba!important',
                "line-height": "36px"
            },
            ".bodycontent":{
                "line-height": "1.4"
            }
        }
    },
    {
        name:'gray',
        style:{
            body:{
                'color':'#9d9fa3',
                'background':'#45484a!important'
            },
            ".bodycontent":{
                "line-height": "1.4"
            }
        }
    },
    {
        name:'night',
        style:{
            body:{
                'color':'#b5aca2',
                'background':'#333333!important',
            },
            ".bodycontent":{
                "line-height": "1.4"
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
const store=useStore()
let inputProgress=ref()
let localProgress=ref()
let touchStartX=ref()
let touchStartY=ref()
let touchStartTime=ref()



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
    console.log(progress,location);
    store.commit('getEpubCFIandPercentage',[location,percentage])
    // console.log(locations.locationFromCfi(location));
    getSection(location)
}

// 检测阅读进度是否存储
const checkReadPro=()=>{
    if (localStorage.getItem('readProgress')==null||localStorage.readProgress=='NaN') {
        localStorage.setItem('readProgress',0)
        localProgress.value=0
    }else{
        localProgress.value=Number(localStorage.getItem('readProgress'))
    }
    inputProgress.value=localProgress.value*100
    onProgressInput(localProgress.value*100)
}

// 挂载完进行调用
if (rendition) {
    checkReadPro()   
}

const showEpub=()=>{
    // 生成book对象
    let book=Epub(DOWNLOAD_URL)
    // 通过book.renderTo()生成rendition对象
    rendition=book.renderTo('read',{
        flow: "auto",
        width:window.innerWidth,
        height:window.innerHeight,
        manager: "default",
        spread: "auto",
        restore: false
    })
    // 通过Rendition.display()渲染电子书
    rendition.display()
    // 获取Theme对象
    themes=rendition.themes
    // 设置默认字体大小
    themes.fontSize(defaultFontSize+'px')
    // themes.register({ "body": { }})
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
        mitter.emit('themes',themes)
        navigationToc=book.navigation.toc
        // 挂载时进行加载
        checkReadPro()
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

// 上一页
const prevPage=()=>{
    if (!judgeSettingFlag()) {
        rendition.prev()
        let start=rendition.location.start
        store.commit('getEpubCFIandPercentage',[start.cfi,start.percentage])
    }
}

// 下一页
const nextPage=()=>{
    if (!judgeSettingFlag()) {
        rendition.next()
        let start=rendition.location.start
        store.commit('getEpubCFIandPercentage',[start.cfi,start.percentage])
    }
}

const bookPagingStart=(e)=>{
    touchStartX.value = e.changedTouches[0].pageX
	touchStartY.value = e.changedTouches[0].pageY
    touchStartTime.value=e.timeStamp
}

const toggleTitleAndMenu=()=>{
    if (SettingFlag.value!=true) {
        MenuShowFlag.value=!MenuShowFlag.value
    }else{
        SettingFlag.value=false
    }
}

const bookPagingEnd=(e)=>{
    const offsetX = e.changedTouches[0].pageX - touchStartX.value
	const offsetY = e.changedTouches[0].pageY - touchStartY.value
	const time = e.timeStamp - touchStartTime.value
	if (time<500&&Math.abs(offsetX) > (Math.abs(offsetY)+20) && offsetX > 50) {
		prevPage();
	} else if (time<500&&Math.abs(offsetX) > (Math.abs(offsetY)+20) && offsetX < -50) {
		nextPage();
	}else if(time<500&&offsetX<=5 && offsetY <=5){
        if (touchStartX.value<window.innerWidth/3) {
            prevPage()
        } else if(touchStartX.value>window.innerWidth-window.innerWidth/3+10){
            nextPage()
        }
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
    // 监听页面关闭时，存储数据
    window.onbeforeunload = function () {
        localStorage.readProgress=store.state.nowPagePercentage
    }
})

onBeforeUnmount(()=>{
    localStorage.readProgress=store.state.nowPagePercentage
})

onUnmounted(()=>{
    ebookDestory.value=false
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
                flex:1;
            }
            .center{
                flex: 1;
            }
            .right{
                flex: 1;
            }
        }
    }
}
</style>
