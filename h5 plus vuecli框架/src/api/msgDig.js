// 调用api时显示的弹窗
import {Toast} from 'vant'
// Toast.allowMultiple()
/**
 *  错误提示
 * */
export function errorAlert (msg) {
  Toast({
    type: 'fail',
    message: msg,
    duration: 2000
  })
}

/**
 *  loading提示
 * */
export class loading {
  constructor () {
    this.toast = '' // 弹窗实例，用于移除
  }

  static loadingAlert (msg) {
    Toast({
      type: 'loading',
      message: msg,
      className: 'common-loading-alert',
      mask: false,
      duration: 0
    })
    this.toast = Toast
  }

  static removeLoading () {
    this.toast && this.toast.clear()
  }
}
