<template>
    <div>
12333
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Epub from 'epubjs'

const DOWNLOAD_URL='/01.epub'

const showEpub=()=>{
    let book=Epub(DOWNLOAD_URL)
    console.log(book);
}
onMounted(()=>{
    showEpub()
})
</script>

<style lang="less" scoped>

</style>
