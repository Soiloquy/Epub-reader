<template>
    <Header title="阅读中"></Header>
    <div class="first-book">
        <img src="../../assets/01.jpg" alt="">
        <div class="context">
            <span class="title">王小波：沉默的大多数（李银河独家授权，并亲自校订全稿。王小波逝世二十周年纪念版！特别收入从未面市的手稿！） (王小波)</span>
            <span class="time">16分钟前</span>
            <button class="continue" @click="readContinue">继续</button>
        </div>
    </div>
    <div class="content-box">
        <span class="title">最近读过</span>
        <div class="book" v-for="item in 5">
            <img src="../../assets/01.jpg" alt="" srcset="">
            <div class="context">
                <span class="title">王小波：沉默的大多数（李银河独家授权，并亲自校订全稿。王小波逝世二十周年纪念版！特别收入从未面市的手稿！） (王小波)</span>
                <span class="time">12分钟前</span>
                <button class="continue" @click="readContinue">继续</button>
            </div>
        </div>
        <div class="tip">注意：确保图书上传到云端，否则无法在其他设备上阅读图书信息</div>
    </div>
    <div>
        <Footer></Footer>
    </div>
</template>

<script setup>
import Footer from '../../components/Footer.vue'
import Header from '../../components/header-bar-base.vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router=useRouter()
const store=useStore()

const readContinue=()=>{
    router.push({path:'/ebook'})
    store.commit('enterEbook',0)
}
</script>

<style lang="less" scoped>
.first-book{
    width: 100%;
    height: 250px;
    display: flex;
    img{
        width: 150px;
        height: 190px;
        margin: 30px 10px 0 20px;
    }
    .context{
        width: 150px;
        height: 180px;
        margin: 35px 0 0 10px;
        font-size: 12px;
        position: relative;
        .title{
            font-size: 16px;
            line-height: 25px;
            // 超过3行省略
            word-break: break-all;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .time{
            display: inline-block;
            margin-top: 5px;
            color: #888888;
        }
        .continue{
            display: block;
            position: absolute;
            bottom: 5px;
            right: 3px;
            width: 100px;
            height: 30px;
            font-size: 16px;
            border-radius: 20px;
            color: #ffffff;
            background-color: #48a6f0;
        }
    }
}
.content-box{
    width: 100%;
    padding: 20px 0 0 23px;
    background-color: #ffffff;
    font-size: 20px;
    .title{
        display: inline-block;
        margin-bottom: 20px;
    }
    .tip{
        font-size: 16px;
        color: #7c7c7c;
        padding-bottom: 20px;
        margin: 20px 20px 0 0;
    }
    .book{
        width: 90%;
        height: 96px;
        border-bottom: 1px solid #cfcfcf;
        display: flex;
        img{
            width: 60px;
            height: 74px;
            margin:11px 0 11px 6px;
        }
        .context{
        width: 160px;
        height: 180px;
        font-size: 12px;
        position: relative;
        .title{
            width: 170px;
            font-size: 13px;
            line-height: 25px;
            margin: 12px 0 5px 10px;
            word-break: break-all;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .time{
            display: inline-block;
            margin-left: 10px;
            color: #888888;
        }
        .continue{
            display: inline-block;
            position: absolute;
            top: 60px;
            right: -80px;
            width: 70px;
            height: 25px;
            line-height: 25px;
            font-size: 14px;
            border-radius: 18px;
            color: #ffffff;
            background-color: #48a6f0;
        }
    }
    }
}
</style>