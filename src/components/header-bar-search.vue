<template>
    <div class="header">
        <div class="fixed-box">
            <div class="title">{{ title }}
            <span @click="()=>title=='书架'?inputBook():inCloud()">{{ icon }}</span>
            </div>
            <div class="search-wrapper">
                <input type="text" placeholder="输入书名，进行筛选" v-model="inputValue" @input="inputChanged">
            </div>
        </div>
    </div>
    <transition name="fade">
        <!-- @touchmove.prevent 禁止页面滚动 / 滚动事件穿透-->
        <div class="mask" @touchmove.prevent @click.self="hiddenInputFooter" v-if="inputBookFlag">
                <div class="input-footer" v-if="inputBookFlag">
                    <div class="online-input-book item">在线传书</div>
                    <div class="wifi-input-book item">WIFI传书</div>
                    <div class="item" @click="inputLocalBook ">导入本地图书</div>
                </div>
        </div>
    </transition>
    <FileChooserOptions></FileChooserOptions>
    <FileChooser></FileChooser>
</template>

<script setup>
import {ref} from 'vue'
import { FileChooser,FileChooserOptions } from '@ionic-native/file-chooser';



let inputValue=ref('')
let inputBookFlag=ref(false)

const props=defineProps({
    title:{type:String,default:''},
    icon:{type:String,default:''}
})

const test=()=>{
    console.log('test!!!');
}

// 监听输入框值的改变
let tmp=''
const inputChanged=(e)=>{
    if(inputValue.value!=''&&inputValue.value!==tmp){
        tmp=inputValue.value
        console.log(inputValue.value);
    }
}

const changFlag=()=>{
    if (!inputBookFlag.value) {
        inputBookFlag.value=!inputBookFlag.value
    }else{
        inputBookFlag.value=!inputBookFlag.value
    }
}

const inputBook=()=>{
    changFlag()
}

const inCloud=()=>{
    console.log('cloud');
}

const hiddenInputFooter=()=>{
    changFlag()
}

// capacitor 读取手机document目录下的文件 Android 10以上不支持读取公有目录的文件
// const readEbookFile = async () => {
//     Filesystem.requestPermissions().then(e=>{
//         console.log(e.publicStorage);
//         if (e.publicStorage=="granted") {
//             const contents = Filesystem.readFile({
//                 path: '/text.txt',
//                 directory: Directory.Documents,
//                 encoding: Encoding.UTF8,
//             });
//             console.log('secrets:', contents);   
//         }
//     })
// };

const readEbookFile=()=>{
    FileChooser.open().then(uri=>{
            console.log(uri);
            //返回文件的uri
            alert(uri);
        }).catch(e => {
            console.log(e)
            alert(e);
        });

}

const inputLocalBook=()=>{
    readEbookFile()
}

</script>

<style lang="less" scoped>
.header{
    width: 100%;
    height: 110px;
    .fixed-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 110px;
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;
        box-shadow: 0px 2px 20px 2px #e6e6e6;
        .title{
            font-size: 24px;
            font-weight: 600;
            margin: 5px 0 0 28px;
            color: rgb(0, 0, 0);
            position: relative;
            span{
                font-family: "iconfont";
                font-size: 28px;
                font-style: normal;
                display: block;
                color: #45a8ea;
                position: absolute;
                width: 30px;
                right: 30px;
                top: 5px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }
        span{
            font-family: "iconfont";
            font-size: 28px;
            font-style: normal;
            width: 90px;
            height: 25px;
            line-height: 25px;
            margin-top: 3px; 
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .search-wrapper{
            width: 100%;
            height: 40px;
            margin-top: 10px;
            input{
                width: 85%;
                height: 40px;
                display: flex;
                margin: 0 auto;
                padding-left: 10px;
                font-size: 16px;
                background-color: #f2f2f2;
                border-radius: 5px;
            }
        }
    }
}
.mask{
    position: relative;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    &.fade-enter-active,
    &.fade-leave-active {
        transition: opacity 0.5s ease;
    }
    &.fade-enter-from,
    &.fade-leave-to {
        opacity: 0;
    }

    &.fade-enter-active .input-footer,
    &.fade-leave-active .input-footer{
        transition: all 0.3s linear;
    }
    &.fade-enter-from .input-footer,
    &.fade-leave-to .input-footer{
        transform: translateY(100%);
    }
    &.fade-enter-to .input-footer,    
    &.fade-leave-from .input-footer{
        transform: translateY(0%);
    }
    .input-footer{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
        background-color: #fff;
        z-index: 101;
        display: flex;
        flex-direction: column;
        div:nth-child(2),
        div:nth-child(3){
            border-top: 4px solid #e0e0e0;
        }
        .item{
            flex:1;
            text-align: center;
            line-height: calc(112px / 3);
            font-size: 16px;
        }
    }
}
</style>