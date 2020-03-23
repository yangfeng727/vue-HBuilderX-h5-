/**
 * 存放请求地址的文件
 */
let commonPlugin = {}
commonPlugin.install = function (Vue, options) {
  /**
   *  所有地址
   * */
  Vue.prototype.$xhrConfig = {
    test: { // 模块名称
      testUrl: '/common/getToken.action' // 接口地址
    }
  }
}
export default commonPlugin
