<template>
    <transition name="fade">
        <div class="toast" v-if="show">
            {{ message }}
        </div>
    </transition>
  </template>
   
  <script setup>
  import { ref,defineExpose } from 'vue';
  let show=ref(false)
  let message=ref('')

let timer
let flage=false
const showMessage=(msg)=> {
    message.value=msg
    if (flage==true) {
        clearInterval(timer)
        flage=false
    }
    show.value = true;
    timer=setTimeout(() => {
      show.value = false;
      flage=false
    }, 2000);
    flage=true
}
defineExpose({showMessage})
  </script>
   
  <style lang="less" scoped>
  .toast {
    position: fixed;
    bottom: 30px;
    right: (50%-10px);
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    background-color: #6d6d6d;
    color: #fff;
    border-radius: 20px;
    z-index: 1000;
    &.fade-enter-active,
    &.fade-leave-active {
        transition: opacity 0.4s ease;
    }

    &.fade-enter-from,
    &.fade-leave-to {
        opacity: 0;
    }
  }
  </style>