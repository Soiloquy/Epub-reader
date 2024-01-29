<template>
    <div class="content fixed">
        <div class="item">
            <router-link to="/" active-class="nav-color">
                <div class="font">
                    &#xe632;
                    <div class="word">阅读中</div>
                </div>
            </router-link>
        </div>
        <div class="item">
            <router-link to="/bookshelf" active-class="nav-color">
                <div class="font">
                    &#xe875;
                    <div class="word">书架</div>
                </div>
            </router-link>
        </div>
        <div class="item">
            <router-link to="/cloud" active-class="nav-color">
                <div class="font">
                    &#xe7d9;
                    <div class="word">云端</div>
                </div>
            </router-link>
        </div>
        <div class="item">
            <router-link to="/home" active-class="nav-color">
                <div class="font">&#xe612;<div class="word">主页</div></div>
                
            </router-link>
        </div>
    </div>
</template>

<script>

</script>

<style lang="less" scoped>
a{
    color: #3d3d3d;
}
.content{
    width: 100%;
    height: 55px;
    display: flex;
    background-color: #fff;
    border-top: 1px solid #f5f5f5;
    box-shadow: 0px 2px 20px 2px #e6e6e6;
    .item{
        flex: 1;
        font-size: 16px;
        text-align: center;
        .nav-color{
            color: blue
        }
        .font{
            font-family: "iconfont";
            font-size: 28px;
            font-style: normal;
            width: 90px;
            height: 25px;
            line-height: 25px;
            margin-top: 3px; 

            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            .word{
                font-size: 14px;
                width: 90px;
                height: 24px;
            
            }
        }
    }
}
.fixed{
    z-index: 1000;
    position: fixed;
    left: 0;
    bottom: 0;
}
</style>