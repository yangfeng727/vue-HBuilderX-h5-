import {$httpGET, $httpPOST, $httpForm} from '../api/api'
import moment from 'moment'
import router from '../router'
import i18n from '../locales/index'

/**
 * 一些公用方法
 */
let commonPlugin = {}
commonPlugin.install = function (Vue, options) {
  Vue.prototype.$httpGET = $httpGET
  Vue.prototype.$httpPOST = $httpPOST
  Vue.prototype.$httpForm = $httpForm

  // 返回上一页 pathName有则跳转到指定页
  Vue.prototype.goBack = function (pathName) {
    if (pathName) {
      router.push({name: pathName})
    } else router.go(-1)
  }

  // 对象获取值
  Vue.prototype.$getObjVal = function (obj, key) {
    return obj && obj[key] ? obj[key] : ''
  }

  // 是否为空对象
  Vue.prototype.$isEmptyObj = function (obj) {
    for (let key in obj) {
      return true
    }
    return false
  }

  /**
   *  金额处理
   * */
  // 获取的金额（分）除以100转换为元
  Vue.prototype.$getMoney = function (money) {
    if (money && !isNaN(money)) {
      return (money / 100).toFixed(2)
    }
    return money
  }
  // 金额（元）乘以100转换为“分”传递到后端
  Vue.prototype.$setMoney = function (money) {
    if (!isNaN(money)) {
      return parseInt(Number(money) * 100)
    }
    return money
  }
  // 金额匹配合适的文本-百万-千万。。 使用时调用addChineseUnit
  Vue.prototype.$moneyCNY = function (value, decimalDigit = 2) {
    // 多少个10000
    let getDigit = function (integer) {
      let digit = -1
      integer = Math.round(integer / 10) * 10
      while (integer >= 1) {
        digit++
        integer = integer / 10000
      }
      return digit
    }

    if (isNaN(value)) { // 不是数字，返回原值
      return value
    }
    value = value * 1
    let syb = 1 // 正负号
    if (value < 0) {
      syb = -1
      value = Math.abs(value)
    }

    let param = []
    let k = 10000
    let sizes = ['', '万', '亿', '万亿', '万万亿']
    let i
    if (value < k) {
      param = [(syb * value).toFixed(decimalDigit), '']
    } else {
      // i = Math.floor(Math.log(value) / Math.log(k))
      i = getDigit(value)
      i > 4 && (i = 4) // 最高显示到万万亿
      let val = (syb * (value / Math.pow(k, i))).toFixed(decimalDigit)
      param = [val, sizes[i]]
    }
    return param
  }

  // 金额匹配合适的文本-百万-千万。。 使用时调用addChineseUnit
  Vue.prototype.$moneyUSD = function (number, decimalDigit = 2) {
    let getDigit = function (integer) {
      let digit = -1
      while (integer >= 1) {
        digit++
        integer = integer / 10
      }
      return digit
    }
    let syb = 1 // 正负号
    if (number < 0) {
      syb = -1
      number = Math.abs(number)
    }
    let integer = Math.floor(number)
    let digit = getDigit(integer)
    if (digit >= 6) {
      if (digit >= 9) { // 上十亿用billion表示
        return [(syb * number / Math.pow(10, 9)).toFixed(decimalDigit), 'B'] // billion
      } else { // 1百万-十亿用million表示
        return [(syb * number / Math.pow(10, 6)).toFixed(decimalDigit), 'M'] // million
      }
    } else { // 小于1百万不做转换
      return [(syb * number).toFixed(decimalDigit), '']
    }
  }
  // 获取金额，并且添加合适的单位（百万，千万，亿等等），返回一个数组 eg：[123,'元']
  /**
   *  @money 金额
   *  @currency 币种名称
   * */
  Vue.prototype.$moneyFomt = function (money, currency) {
    switch (currency) {
      case '￥':
        return this.$moneyCNY(this.$getMoney(money))
      case '$':
      default: // $ 外币显示方式
        return this.$moneyUSD(this.$getMoney(money))
    }
  }

  /**
   *  时间处理
   * */
  // 将时间戳转换为时间格式
  Vue.prototype.$getTime = function (time, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(time).format(format)
  }

  // 拼接期数与时间 生成如：2019/1900 6月 20:21:19
  // @time 时间 @period 期数
  Vue.prototype.$getPeriodTime = function (time, period) {
    let finalTime = ''
    if (typeof time === 'number') { // 传递的时间是时间戳格式，则转换未字符串时间格式
      time = this.$getTime(time)
    }
    if (typeof time === 'string') {
      try {
        let timeArr = time.split(' ')
        let yM = timeArr[0].split('-')
        // finalTime = `${yM[0]}/${period} ${parseInt(yM[1])}月 ${timeArr[1]}`
        finalTime = `${yM[0]}/${period} ${parseInt(yM[1])}${i18n.t('M')} ${timeArr[1]}` // 国际化
        return finalTime
      } catch (e) {
      }
    }
    return time
  }

  /**
   *  银行卡处理
   * */
  // 银行卡格式化为1234 **** **** 1234
  Vue.prototype.$cardNoFormat = function (val) {
    let num = 0
    if (val.length > 8) {
      num = 4
    } else if (val.length > 6) {
      num = 3
    } else if (val.length > 4) {
      num = 2
    } else {
      num = 1
    }
    return `${val.substr(0, num)} **** **** ${val.substr(-num)}`
  }
  // 银行卡获取后4位
  Vue.prototype.$getLastCardNo = function (cardNo, num = 4) {
    return cardNo ? cardNo.substr(-1 * num) : ''
  }
  /**
   * 获取图片的容错处理
   * @name 图片名称
   * @path 图片的路径
   * @defaultName 默认图片
   * */
  Vue.prototype.$getImg = function (name, path = 'icon/', defaultName = '') {
    let thisImg = ''
    try {
      thisImg = require(`@/assets/${path}${name}.png`)
    } catch (e) {
      defaultName && (thisImg = require(`@/assets/${path}${defaultName}.png`))
    }
    return thisImg
  }
}
export default commonPlugin
