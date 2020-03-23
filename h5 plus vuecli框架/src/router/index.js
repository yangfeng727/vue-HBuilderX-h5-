import Vue from 'vue'
import Router from 'vue-router'
// 首页
const HelloWorld = resolve => require(['@/components/HelloWorld'], resolve)
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'helloWorld',
      component: HelloWorld
    }
  ]
})

export default router

export function getRouter () {
  return router
}
