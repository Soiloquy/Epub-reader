<template>
    <div>
        <Header title="书架" icon="&#xe609;"></Header>
        <div class="header-bookshelf">
            <button class="all-book">全部图书<span>&#xe8d8;</span></button>
            <button class="sort">排序<span>&#xe8d8;</span></button>
        </div>
        <div class="big-content">
            <div class="book-content" v-for="item in 11" @click="gotoEbook">
                <div class="time">12天前读过</div>
                <img src="../../assets/02.jpg" alt="">
                <div class="intro">天才在左 疯子在右【累计销量破500万册！借疯子的策略，唤醒你未知的灵魂！高圆圆、陈乔恩、李宇春、胡歌、刘昊然盛情推荐！】 (高铭)</div>
            </div>
            <div class="button-content"><button>&#xe609;</button></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script setup>
import Footer from '../../components/Footer.vue'
import Header from '../../components/header-bar-search.vue'
import { useRouter } from 'vue-router'

const router=useRouter()

let gotoEbook=()=>{
    router.push({path:'/ebook'})
    console.log(123);
}
</script>

<style lang="less" scoped>
.header-bookshelf{
    width: 80%;
    height: 55px;
    border-bottom: 1px solid #cacaca;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .all-book{
        margin: 20px 0 0 0;
        display: block;
        font-size: 18px;
        span{
            font-family: "iconfont";
            font-size: 24px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    }
    .sort{
        margin: 20px 0 0 0;
        font-size: 18px;
        span{
            font-family: "iconfont";
            font-size: 24px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    }
}
.big-content{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    .book-content{
        width: 100px;
        height: 215px;
        margin: 20px 0 0 15px;
        .time{
            color: #929091;
            margin:0 0 5px 3px;
            font-size: 12px;
        }
        img{
            width: 100%;
            height: 140px;
        }
        .intro{
            font-size: 14px;
            margin: 5px 0 0 3px;
            line-height: 23px;
            word-break: break-all;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    .button-content{
    width: 100px;
    height: 215px;
    margin: 20px 0 0 15px;
    button{
        display:inline-block;
        width: 100%;
        height: 140px;
        margin-top: 25px;
        background-color: #e4e4e4;
        font-family: "iconfont" !important;
        font-size: 75px;
        color: #979797;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
}
}


</style>