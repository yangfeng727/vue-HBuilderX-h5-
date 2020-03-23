// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' // 引入store
import i18n from '@/locales'
import {Button, Field, Cell, CellGroup, Lazyload, Toast} from 'vant'
import 'lib-flexible'
import '@/assets/css/index.less'
// 自定义公共方法
import xhrUrlConfig from './plugins/xhrUrlConfig' // 所有接口的地址
import commonPlugin from './plugins/common'
import comGetHttp from './plugins/comGetHttp'

require('es6-promise').polyfill()
Vue.config.productionTip = false
Vue.use(Field)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Button).use(Lazyload)
Vue.use(Toast)
// Vue.use(utilPlugin)
Vue.use(xhrUrlConfig)
Vue.use(commonPlugin)
Vue.use(comGetHttp)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n, // i18n
  router,
  store,
  components: {App},
  template: '<App/>',
  beforeCreate () {
    // 获取token
    // this.$httpGET({
    //   url: '/common/getToken.action',
    //   offMsg: false,
    //   offLoad: false
    // }).then((res) => {
    //   // console.log('token信息', res)
    //   this.$store.state.token = res.token
    // })
  },
  mounted () {
    // 解决ios 10+ user-scale失效的问题
    document.documentElement.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) event.preventDefault()
    }, false)
    var lastTouchEnd = 0
    document.documentElement.addEventListener('touchend', function (event) {
      var now = (new Date()).getTime()
      if (now - lastTouchEnd <= 300) event.preventDefault()
      lastTouchEnd = now
    }, false)
  }
})
router.afterEach(route => {
  document.getElementById('app').scrollTop = 0
})
