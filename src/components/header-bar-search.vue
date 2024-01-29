<template>
    <div class="header">
        <div class="fixed-box">
            <div class="title">{{ title }}
            <span>{{ icon }}</span>
            </div>
            <div class="search-wrapper">
                <input type="text" placeholder="输入书名，进行筛选">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                inputData:''
            }
        },
        props:{
            title:{type:String,default:''},
            icon:{type:String,default:''}
        }
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
            font-weight: 700;
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
</style>