import { createStore } from "vuex";

export default createStore({
    state:{
        // 存储当前页面的cfi
        nowPageEpubCFI:'',
        // 存储当前页面的percentage
        nowPagePercentage:0
    },
    mutations:{
        getEpubCFIandPercentage(state,[cfi,percentage]){
            state.nowPageEpubCFI=cfi
            state.nowPagePercentage=percentage
        }
    },
    actions:{

    },
    getters:{

    }
})