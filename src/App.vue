<template>
  <IonPage>
    <router-view></router-view>
  </IonPage>
</template>

<script setup>
import { IonPage } from '@ionic/vue';
import { App as CapacitorApp } from '@capacitor/app';

// 添加回退侦听器，以便我们可以推回或退出应用程序
CapacitorApp.addListener('backButton', ({canGoBack}) => {
  if(canGoBack){
    window.history.back();
  } else {
    CapacitorApp.exitApp();    
  }
});

</script>

<style>
   ::-webkit-scrollbar {
     width: 0 !important;
   }
   ::-webkit-scrollbar {
     width: 0 !important;height: 0;
   }
</style>
