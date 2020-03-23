import {$httpGET, $httpPOST, $httpForm} from '../api/api'
import moment from 'moment'
import router from '../router'

/**
 * 一些公用方法
 */
let commonPlugin = {}
commonPlugin.install = function (Vue, options) {
  Vue.prototype.$httpGET = $httpGET
  Vue.prototype.$httpPOST = $httpPOST
  Vue.prototype.$httpForm = $httpForm

  /**
   *  跳转到指定页面（此方法在用于多个页面跳转到同一个页面，造成页面不知回退到哪的问题）
   *  @path 对象
   * */
  Vue.prototype.$mutiGoSamePath = function (path) {
    this.$store.commit('changeBackPath', this.$route.fullPath)
    this.$router.push(path)
  }

  // 返回上一页 pathName有则跳转到指定页
  Vue.prototype.goBack = function (pathName) {
    if (Object.prototype.toString.call(pathName) === '[object Object]') { // 带参数时的跳转
      router.push({...pathName})
    } else if (pathName) {
      router.push({name: pathName})
    } else {
      router.go(-1)
    }
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

  // 国际化相关
  /**
   *  根据字母汉字等排序
   *  @arr 将数组排序
   * */
  Vue.prototype.$localeCompare = function (arr) {
    let lang = window.i18n.locale // 当前语言类型
    if (lang.toLowerCase().indexOf('zh') > -1) { // 中文
      arr.sort(
        function compareFunction (a, b) {
          return a.localeCompare(b, 'zh')
        }
      )
    } else { // 英文等
      arr.sort(function (a, b) {
        return a.localeCompare(b)
      })
    }
    return arr
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
    // switch (currency) {
    //   case '￥':
    //     return this.$moneyCNY(this.$getMoney(money))
    //   case '$':
    //   default: // $ 外币显示方式
    //     return this.$moneyUSD(this.$getMoney(money))
    // }
    return money
  }

  /**
   *  时间处理
   * */
  // 获取小时
  Vue.prototype.$getCHour = function () {
    return moment().hour()
  }
  // 获取当前时间
  Vue.prototype.$getCTime = function (format = 'YYYY-MM-DD HH:mm:ss') {
    // moment().locale('en-NZ').format('YYYY-MM-DD HH:mm:ss')
    return moment().format(format)
  }
  // 将时间戳转换为时间格式
  Vue.prototype.$getTime = function (time, format = 'YYYY-MM-DD HH:mm:ss') {
    if (time === '') {
      return ''
    }
    return moment(time).format(format)
    // moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  }
  // 将时间转时间戳
  Vue.prototype.$getTimeNum = function (timeStr) {
    // return moment('1995-12-25').valueOf()
    return moment(timeStr).valueOf()
  }

  /**
   * 获取图片的容错处理
   * @name 图片名称
   * @path 图片的路径
   * @defaultName 默认图片
   * */
  Vue.prototype.$getImg = function (name, path = 'img/', defaultName = 'default') {
    if (/data:image/.test(name) || /^http[s]?:\/\//.test(name)) { // 当前图片是base64，或者地址，直接返回
      return name
    }
    let thisImg = ''
    try {
      thisImg = require(`@/assets/${path}${name}.png`)
    } catch (e) {
      defaultName && (thisImg = require(`@/assets/${path}${defaultName}.png`))
    }
    return thisImg
  }

  // 传到后端删除base64，显示前端加上base64
  Vue.prototype.$base64Img = function (img, path = 'img/', defaultName = 'default') {
    if (!img) {
      return require(`@/assets/${path}${defaultName}.png`)
    }
    try {
      if (/data:image\//.test(img)) {
        return img.split('base64,')[1]
      } else {
        return `data:image/png;base64,${img}`
      }
    } catch (e) {
      return require(`@/assets/${path}${defaultName}.png`)
    }
  }

  /**
   * canvas压缩图片
   * @param {图片路径} obj.path 图片路径base64
   * @param {输出图片宽度} obj.width 等比缩放不用传宽度高度
   * @param {输出图片名称} obj.fileName 不传初始赋值image
   * @param {压缩图片程度} obj.quality 不传初始赋值0.8。值范围0~1
   * @param {压缩图片的类型} obj.type image/jpeg || image/png
   * @param {期望压缩图片的大小(单位kb)} obj.targetSize （最多压缩次数压缩后都比期望尺寸大则弹出错误）
   * @param {回调函数} callback
   */
  Vue.prototype.$pressImg = function (obj, callbackFn) {
    if (!obj.path) {
      callbackFn('')
      return true
    }
    if (obj.targetSize && this.$dataURLtoFile(obj.path, 'img').size / 1024 < obj.targetSize) { // 当前图片小于目标压缩大小，直接返回
      callbackFn(obj.path) // base64
      return true
    }
    let curNum = 1 // 当前压缩次数
    let maxNum = 5 // 最多压缩次数
    let self = this
    let img = new Image()
    img.src = obj.path
    img.onload = function () {
      let canvas = document.createElement('canvas')// 创建canvas元素
      let width = img.width // 确保canvas的尺寸和图片一样
      let height = img.height
      let type = obj.type ? obj.type : 'image/jpeg'
      let quality = obj.quality ? obj.quality : 0.8
      canvas.width = obj.width ? obj.width : width
      canvas.height = obj.height ? obj.height : height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height) // 将图片绘制到canvas中
      let press = function () {
        return canvas.toDataURL(type, quality) // 转换图片为dataURL
      }
      let base64 = press()
      if (obj.targetSize) { // 有大小限制则递归压缩
        while (self.$dataURLtoFile(base64, 'img').size / 1024 > obj.targetSize) {
          console.log('图片压缩次数', curNum)
          console.log('压缩后的图片大小', self.$dataURLtoFile(base64, 'img').size / 1024)
          if (curNum === maxNum) { // 达到最大压缩次数
            base64 = 'large' // 图片过大，请重新上传
            break
          }
          curNum++
          // 递归压缩发现到后面图片大小基本不变，这里采用更简单的方法更改压缩质量
          quality = quality / 2
          base64 = press()
        }
      }
      callbackFn && callbackFn(base64)
      return true
    }
    img.onerror = function () {
      callbackFn && callbackFn('err')
      return false
    }
  }

  /**
   * 将base64转换为文件流
   * @param {baseURL} dataurl
   * @param {文件名称} filename
   * @return {文件二进制流} 文件大小单位是b
   */
  Vue.prototype.$dataURLtoFile = function (dataurl, filename) {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime})
  }

  /**
   * 将file文件转化为base64
   * @param {二进制文件流} file
   * @param {回调函数，返回base64} fn
   */
  Vue.prototype.$changeFileToBaseURL = function (file, fn) {
    // 创建读取文件对象
    let fileReader = new FileReader()
    // 如果file没定义返回null
    if (file === undefined) return fn(null)
    // 读取file文件,得到的结果为base64位
    fileReader.readAsDataURL(file)
    fileReader.onload = function () {
      // 把读取到的base64
      let imgBase64Data = this.result
      fn(imgBase64Data)
    }
  }

  // 本来为对象，却返回null造成页面渲染失败  按照defaultObj的初始格式来给mergObj设置初值
  Vue.prototype.$objMerge = function (defaultObj, mergObj) {
    for (let x in mergObj) {
      if (!mergObj[x]) {
        if (Object.prototype.toString.call(defaultObj[x]) === '[object Array]') {
          mergObj[x] = []
        } else if (Object.prototype.toString.call(defaultObj[x]) === '[object Object]') {
          mergObj[x] = {}
        }
      }
    }
    return mergObj
  }

  // 合并不为空的对象值
  Vue.prototype.$objMergeVal = function (defaultObj, mergObj) {
    let obj = {}
    for (let x in defaultObj) {
      if (mergObj[x] === '' || !mergObj[x]) {
        obj[x] = defaultObj[x]
      } else {
        obj[x] = mergObj[x]
      }
    }
    return obj
  }

  // 数组转对象
  Vue.prototype.$arrToObj = function (arr, key = 'item') {
    let obj = {}
    arr && arr.map((item, index) => {
      if (key === 'item') {
        obj[item] = item // key和name相同
      } else {
        obj[index] = item // key为index
      }
    })
    return obj
  }

  // 对象转数组
  Vue.prototype.$objToArr = function (obj) {
    let arr = []
    for (let x in obj) {
      arr.push(obj[x])
    }
    return arr
  }

  /**
   *  去掉首尾空格
   * */
  Vue.prototype.$delSpace = function (val) {
    if (!val) {
      return val
    }
    return val.replace(/^\s|\s$/g, '')
  }

  /**
   * 数组去重
   * */
  Vue.prototype.$arrDelDuplication = function (arr) {
    let brr = []
    arr.map((item) => {
      if (brr.indexOf(item) === -1) {
        brr.push(item)
      }
    })
    return brr
  }

  /**
   * 返回币种对应的符号
   * */
  Vue.prototype.$getCurrencyUnit = function (currency) {
    let unitObj = { // 所有币种对应的符号
      'USD': '$', // 美元
      'JPY': 'J￥', // 日元
      'EUR': '€', // 欧元
      'CHF': 'CHF', // 瑞士法郎
      'GBP': '￡', // 英镑
      'CAD': 'C$', // 加拿大元
      'AUD': 'A$', // 澳大利亚元
      'HKD': 'HK$', // 港币
      'CNY': '¥' // 人民币
    }
    return this.$getObjVal(unitObj, currency)
  }

  // 输入框光标位置
  /**
   *  获取光标位置
   *  @dom 当前input dom
   * */
  Vue.prototype.getCursorPosition = function (dom) {
    let el = dom
    let pos = 0
    if ('selectionStart' in el) {
      pos = el.selectionStart
    } else if ('selection' in document) { // ie浏览器
      el.focus()
      let Sel = document.selection.createRange()
      let SelLength = document.selection.createRange().text.length
      Sel.moveStart('character', -el.value.length)
      pos = Sel.text.length - SelLength
    }
    return pos
  }
  /**
   *  定位光标位置
   *  @ctrl input dom
   *  @pos 光标位置
   * */
  Vue.prototype.setCaretPosition = function (ctrl, pos) {
    ctrl.focus()
    if (ctrl.setSelectionRange) {
      setTimeout(() => {
        ctrl.focus()
        ctrl.setSelectionRange(pos, pos)
      })
    } else if (ctrl.createTextRange) { // ie浏览器
      let range = ctrl.createTextRange()
      range.collapse(true)
      range.moveEnd('character', pos)
      range.moveStart('character', pos)
      range.select()
    }
    // if (ctrl.selectionStart) { // 非IE浏览器
    //   debugger
    //   // ctrl.selectionStart = pos
    //   ctrl.selectionEnd = pos
    // } else { // IE
    //   let range = ctrl.createTextRange()
    //   range.move('character', pos)
    //   range.select()
    // }
  }

  // storage
  /**
   *  将数据保存到本地storage
   *  @params key
   *  @params value
   * */
  Vue.prototype.$setStorage = function (key, value) {
    if (window.plus) {
      plus.storage.setItem(key, value)
    } else {
      window.localStorage.setItem(key, value)
    }
  }

  /**
   *  获取本地storage
   *  @params key
   * */
  Vue.prototype.$getStorage = function (key) {
    if (window.plus) {
      return plus.storage.getItem(key)
    } else {
      return window.localStorage.getItem(key)
    }
  }

  /**
   *  删除storage 某个键值对
   *  @param key
   * */
  Vue.prototype.$removeStorage = function (key) {
    if (window.plus) {
      plus.storage.removeItem(key)
    } else {
      window.localStorage.removeItem(key)
    }
  }

  /**
   *  删除所有本地storage
   * */
  Vue.prototype.$clearStorage = function () {
    if (window.plus) {
      plus.storage.clear()
    } else {
      window.localStorage.clear()
    }
  }

  /**
   *  更改手机回退键的值
   * */
  Vue.prototype.$changeAppBackPath = function (path) {
    window.plus_back_path = path
  }
}
export default commonPlugin
