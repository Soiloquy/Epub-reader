<template>
    <div>
        <transition name="slide">
            <div class="setting-containter" v-show="SettingFlag">
                <div class="background-color settings">
                    <div class="background-color-item" v-for="(item,index) in themeList.slice(0,4)" :key="index">
                        <div class="bkc" :style="{background:item.style.body.background}"
                        :class="{'select':index===thisDefaultTheme}" @click="setTheme(index)"></div>
                    </div>
                    <div class="bkc night icon" :class="{'select':thisDefaultTheme===4}" @click="setTheme(4)">&#xe608;</div>
                </div>
                <div class="intensity-control settings">
                    <div class="text">亮度</div>
                    <div class="center"  @touchmove="changeBrightness" @touchend="changeBrightness">
                        <input class="progress" type="range"
                               max="100" min="0" step="1"
                               :value="progress"
                               ref="progressEle"
                               @input="brightnessInput(progressEle.value)"
                        >
                    </div>
                    <button class="auto-button" @click="changeBrightnessAuto" :class="{'auto':brightnessAuto==true}">自动</button>
                </div>
                <div class="font-size settings">字体
                    <button @click="fontSizeDown">A-</button>
                    <button @click="fontSizeUp">A+</button>
                </div>
                <div class="interval settings">
                    <div class="text">间距</div>
                    <div class="icon interval-icon" :class="{'active':interval=='1.2'}" @click="intervalChange('1.2')">&#xe70b;</div>
                    <div class="icon interval-icon" :class="{'active':interval=='1.4'}" @click="intervalChange('1.4')">&#xe72f;</div>
                    <div class="icon interval-icon" :class="{'active':interval=='1.8'}" @click="intervalChange('1.8')">&#xe78e;</div>
                </div>
                <div class="paging settings">翻页</div>
                <div class="more-setting settings">更多设置
                    <div class="more icon">&#xe642;</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { defineProps,defineEmits,watch,ref, reactive,onBeforeMount } from 'vue';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import mitter from '@/plugins/Bus';


const emit=defineEmits(['fontSizeDown','fontSizeUp','setTheme'])
const props=defineProps({
    SettingFlag:{type:Boolean,default:false},
    themeList:{type:Array,default:[]},
    defaultTheme:{type:Number,default:0}
})
let progress=ref(30)
let progressEle=ref()
let brightnessAuto=ref(true)
let interval=ref('1.4')
let thisDefaultTheme=ref(props.defaultTheme)
let themes=reactive({})

const changeBrightness=async ()=>{
    if (brightnessAuto.value==true) {
        brightnessAuto.value=false
    }
    // Set the brightness:
    let brightness=progress.value/100
    await ScreenBrightness.setBrightness({ brightness });

    // Get the current brightness:
    const getbrightness = await ScreenBrightness.getBrightness();
}

const brightnessInput=(e)=>{
    progress.value=e
}

const changeBrightnessAuto=async()=>{
    brightnessAuto.value=true
    const brightness=-1
    await ScreenBrightness.setBrightness({brightness})
    progress.value=30
}

const intervalChange=(value)=>{
    interval.value=value
    themes.register("lineHeight",{".bodycontent":{"line-height": value+"!important"}})
    themes.select("lineHeight")
}

const fontSizeDown=()=>{
    emit('fontSizeDown')
}
const fontSizeUp=()=>{
    emit('fontSizeUp')
}
const setTheme=(index)=>{
    emit('setTheme',index)
}
watch(()=>props.defaultTheme,(newVal)=>{
    thisDefaultTheme.value=newVal
})

onBeforeMount(() => {
    mitter.on('themes',e=>{
        themes=e
        console.log(themes);
    })
})
</script>

<style lang="less" scoped>
.setting-containter{
        width: 100%;
        height: 336px;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 101;
        font-size: 18px;
        box-shadow: 0 -3px 3px rgba(0, 0, 0, .1);
        &.slide-enter-active,
        &.slide-leave-active {
            transition: all 0.1s linear;
        }
        &.slide-enter-from,
        &.slide-leave-to {
            transform: translateY(100%);
        }
        &.slide-enter-to,
        &.slide-leave-from {
            transform: translateY(0%);
        }
        .settings{
            width: 85%;
            height: 56px;
            margin: 0 auto;
            line-height: 56px;
            border-bottom: 1px solid #d4d4d4;
            position: relative;
            .more{
                position: absolute;
                font-size: 28px;
                font-weight: 700;
                right: 5px;
                top: 2px;
            }
        }
        .font-size{
            display: flex;
            align-items: center;
            button{
                display: block;
                width: 100px;
                height: 30px;
                font-size: 16px;
                border-radius: 20px;
                margin-left: 22px;
                border: 1px solid #1d1d1d;
                background-color: #fff;
            }
        }
        .background-color{
            display: flex;
            justify-content: center;
            align-items: center;
            .bkc{
                width: 40px;
                height: 40px;
                margin:0 7px 0 7px;
                border-radius: 50%;
                border: 1px solid #ccc;
                &.select{
                    border: 2px solid#3ca4fa;
                }
                
            }
            .night{
                color: #8c8a8b;
                line-height: 40px;
                text-align: center;
                font-size: 25px;
                background-color: #333333;
            }
        }
        .intensity-control{
            display: flex;
            align-items: center;
            .center{
                width: 180px;
                height: 100%;
                line-height: 50px;
                margin: 0 10px 0 10px;
                .progress {
					width:100%;
					height:4px;
					background:-webkit-linear-gradient(#999,#999) no-repeat #ddd;
					background-size:0 100%;
					&:focus {
						outline:none;
					}
					&::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #fff;
                        border: 1px solid #ddd;
                        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
					}
				}
            }
            .auto-button{
                background-color: #fff;
                width: 70px;
                height: 35px;
                font-size: 18px;
                border: 1px solid #d4d4d4;
                border-radius: 10px;
                &.auto{
                    border: 1px solid #3ca4fa;
                }
            }
        }
        .interval{
            display: flex;
            align-items: center;
            .interval-icon{
                text-align: center;
                width: 60px;
                height: 35px;
                line-height: 35px;
                font-size: 22px;
                background-color: #e7e7e7;
                border-radius: 15px;
                margin-left:20px;
                &.active{
                    background-color: #1d1d1d;
                    color: #fff;
                }
            }
        }
    }
</style>