<template>
  <!-- <div>
    <router-view></router-view>
  </div> -->
  <IonPage>
    <router-view></router-view>
  </IonPage>
</template>

<script setup>
import { IonPage } from '@ionic/vue';
</script>

<style>
   ::-webkit-scrollbar {
     width: 0 !important;
   }
   ::-webkit-scrollbar {
     width: 0 !important;height: 0;
   }
</style>
