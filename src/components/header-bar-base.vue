<template>
    <div class="header">
        <div class="fixed-box">
            <div class="title">{{ title }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            title:{type:String,default:''}
        }
    }
</script>

<style lang="less" scoped>
.header{
    width: 100%;
    height: 55px;
    .fixed-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 55px;
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;
        box-shadow: 0px 2px 20px 2px #e6e6e6;
        z-index: 100;
    }
    .title{
        font-size: 24px;
        font-weight: 600;
        margin: 8px 0 0 14px;
        color: rgb(0, 0, 0);
    }
}
</style>