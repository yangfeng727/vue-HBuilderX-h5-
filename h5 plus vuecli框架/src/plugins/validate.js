/**
 * 正则验证
 */
let commonPlugin = {}
commonPlugin.install = function (Vue, options) {
  /**
   *  邮箱验证
   * */
  Vue.prototype.$isEmail = function (val) {
    let reg = /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
    // ^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w{2,3}){1,3})$"
    return reg.test(val)
  }

  /**
   *  手机验证
   * */
  Vue.prototype.$isPhone = function (val) {
    let reg = /^(\d+)$/
    return reg.test(val)
  }

  /**
   *  密码规则验证
   * */
  Vue.prototype.$isPwd = function (val) {
    // let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/ // 包含字母，数字，特殊字符
    let reg = /((?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[!\\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=\S+$).{8,})/ // 至少1个大写字母，至少1个小写英文字母，至少1位数字，至少有1个特殊字符，最小8个长度
    return reg.test(val)
  }
}
export default commonPlugin
