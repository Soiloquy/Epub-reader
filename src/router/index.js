import { createRouter,createWebHashHistory} from 'vue-router'

// 创建路由器
let router=createRouter({
    // 路由模式hash
    history:createWebHashHistory(),
    routes:[
        {
            path:'/home',
            component:()=>import('../views/home'),
            name:'home',
            meta:{
                title:'我的',
                hidden:false
            }
        },
        {
            path:'/',
            component:()=>import('../views/reading'),
            name:'reading'
        },
        {
            path:'/bookshelf',
            component:()=>import('../views/bookshelf'),
            name:'bookshelf'
        },
        {
            path:'/cloud',
            component:()=>import('../views/cloud'),
            name:'cloud',
            meta:{
                title:'云端',
                hidden:false
            }
        },
        {
            path:'/login',
            component:()=>import('../views/login'),
            name:"login"
        },
        {
            path:'/404',
            component:()=>import('../views/404'),
            name:'404',
            meta:{
                title:'404',
                hidden:true
            }
        },
        {
            path:'/:pathMatch(.*)*',
            redirect:'/404',
            name:'any',
            meta:{
                title:'任意路由',
                hidden:true
            }
        }
    ]
})

export default router