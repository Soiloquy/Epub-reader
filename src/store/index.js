import { createStore } from "vuex";

export default createStore({
    state:{
        // 存储当前页面的cfi
        nowPageEpubCFI:'',
        // 存储当前页面的percentage
        nowPagePercentage:0,
        // 存储进入ebook组件的页面:0为reading，1为bookshelf
        enterEbook:0,
        // 存储当前设备图书的本地路径
        // localbookUri:[]
    },
    mutations:{
        getEpubCFIandPercentage(state,[cfi,percentage]){
            state.nowPageEpubCFI=cfi
            state.nowPagePercentage=percentage
        },
        enterEbook(state,value){
            state.enterEbook=value
        }
    },
    actions:{

    },
    getters:{

    }
})