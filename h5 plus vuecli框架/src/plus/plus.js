/**
 *  说明：该文件存放当前项目使用的plus调用,调用时需要将this绑定为vue
 *  author：yf
 * */

/**
 * 返回
 * */
function plusGoBack () {
  let self = this
  let first = null
  plus.key.addEventListener('backbutton', function () {
    // 首次按键，提示 再按一次退出应用
    if (!first) {
      first = new Date().getTime() // 记录第一次按下回退键的时间
      self.goBack(window.plus_back_path)
      // history.go(-1) // 回退到上一页面
      setTimeout(() => {
        // 1s中后清除
        first = null
      }, 1000)
    } else {
      if (new Date().getTime() - first < 1000) {
        // 如果两次按下的时间小于1s，
        plus.runtime.quit() // 那么就退出app
      }
    }
  })
}

// 统一 plus alert
function plusAlert (msg) {
  let self = this
  plus.nativeUI.alert(msg, () => {
  }, '', self.$t('plus.confirm'))
}

/**
 * 拍照
 * */
function takePhoto (callback) {
  let self = this
  let a = [{
    title: self.$t('plus.Photograph'),
    color: '#0794ef'
  }, {
    title: self.$t('plus.album'),
    color: '#0794ef'
  }]
  plus.nativeUI.actionSheet({
    // title: '修改用户头像',
    cancel: self.$t('plus.cancel'),
    buttons: a
  }, function (b) { // actionSheet 按钮点击事件
    switch (b.index) {
      case 0:
        // 取消
        break
      case 1:
        // 拍照
        appendByCamera((path) => {
          callback && callback(path)
        })
        break
      case 2:
        // 打开相册
        appendByGallery((path) => {
          callback && callback(path)
        })
        break
      default:
        break
    }
  })
}

/**
 *  从相册添加文件
 * */
function appendByGallery (callback) {
  // let self = this
  plus.gallery.pick(function (path) {
    // console.log(path)
    // self.picture = path
    callback && callback(path)
    // upload(path)
  }, function (e) {
    // 错误
    plus.nativeUI.toast(self.$t('plus.err2') + e.message)
    callback && callback()
  })
}

/**
 * 调用手机摄像头并拍照
 */
function appendByCamera (callback) {
  let self = this
  let cmr = plus.camera.getCamera()
  let res = cmr.supportedImageResolutions[0]
  let fmt = cmr.supportedImageFormats[0]
  cmr.captureImage(function (p) {
    plus.io.resolveLocalFileSystemURL(p, function (entry) {
      // compressImage(entry.toLocalURL(), entry.name)
      // console.log('调用手机摄像头并拍照', entry)
      let path = entry.toLocalURL()
      // self.picture = path
      callback && callback(path)
      // upload(path)
    }, function (e) {
      plus.nativeUI.toast(self.$t('plus.err') + e.message)
      callback && callback()
    })
  }, function (e) {
    // err
    plus.nativeUI.toast(self.$t('plus.err2') + e.message)
    callback && callback()
  }, {resolution: res, format: fmt})
}

/**
 *  读取文件并压缩
 *  @param  param.path 读取的图片路径
 *  @param  param.targetSize 图片压缩大小不超过多少
 *  @param  param.callback 回调函数
 * */
function readFileAndPressImg ({path = '', targetSize = 1024}, callback) {
  let self = this
  if (!path) {
    callback && callback('')
    return false
  }
  let wt = plus.nativeUI.showWaiting() // 显示原生loading
  // 根据路径读取到文件
  plus.io.resolveLocalFileSystemURL(path, function (entry) {
    entry.file(function (file) {
      let fileReader = new plus.io.FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onloadend = function (e) {
        // 压缩图片
        self.$pressImg({
          path: e.target.result,
          targetSize: targetSize // 不超过1024kb
        }, (base64) => {
          wt.close()
          callback && callback(base64)
        })
      }

      fileReader.onerror = function () {
        wt.close()
        plusAlert.call(self, self.$t('plus.fileReadFail'))
      }
    })
  })
}

/**
 * 上传文件（图片本身）
 * */
function upload (path) {
  // 服务端接口路径
  let server = 'http://192.168.100.149:8085/packagePK/package/uploadImg'
  console.log(server)
  let wt = plus.nativeUI.showWaiting() // 显示原生loading
  let task = plus.uploader.createUpload(server,
    {method: 'POST'},
    function (t, status) { // 上传完成
      if (status === 200) {
        let data = JSON.parse(t.responseText)
        console.log(data.data)
        alert('上传成功：' + t.responseText)
        wt.close() // 关闭等待提示按钮
      } else {
        alert('上传失败：' + status)
        wt.close() // 关闭等待提示按钮
      }
    }
  )
  // 添加其他参数
  task.addData('name', 'test')
  task.addFile(path, {key: 'file'})
  task.start()
}

/**
 *  读取通讯录
 * */
function readContacts (callback) {
  // let s = plus.navigator.checkPermission('CONTACTS')
  // if (s !== 'notdeny') {
  //   plus.nativeUI.alert('联系人权限未获取，请往设置应用程序里面开启权限!')
  //   return
  // }
  let self = this
  plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, (addressBook) => {
    // console.log(addressBook, 444)
    addressBook.find('', function (contacs) {
      let arr = []
      // console.log('所有联系人', contacs, 555)
      contacs.map((item, index) => {
        if (item.phoneNumbers.length > 0) {
          let arrNone = {
            name: item.displayName, // 全名
            mobileNumbers: item.phoneNumbers.map(sub => sub.value),
            emails: item.emails.map(sub => sub.value),
            firstName: item.name.familyName ? item.name.givenName : item.displayName, // 名称
            lastName: item.name.familyName // 姓名
            // firstName: item.displayName, // 名称
            // lastName: '' // 姓名
          }
          arr.push({
            ...arrNone,
            key: `${item.displayName}-${item.phoneNumbers[0] ? item.phoneNumbers[0].value : ''}-${item.emails[0] ? item.emails[0].value : ''}` // key用于去重
          })
        }
      })
      // 去重
      let obj = {}
      arr = arr.reduce(function (item, next) {
        if (!obj[next.key]) {
          obj[next.key] = true
          item.push(next)
        }
        // obj[next.key] ? '' : (obj[next.key] = true && item.push(next))
        return item
      }, [])
      // console.log(arr, '去重后')
      callback && callback(arr) // 去重后的通讯录数据
      // 数据样式
      // phoneNumbers = [{
      //   id: '458',
      //   pref: false,
      //   type: 'mobile',
      //   value: '555555555555'
      // }]
      // emails = [{
      //   id: "459",
      //   pref: false,
      //   type: "work",
      //   value: "11@qq.com"
      // }]
    }, function (e) {
      // 查找失败
      console.log(e.message)
      plusAlert.call(self, self.$t('plus.contactsReadFail'))
    })
  }, () => {
    // 失败
    plusAlert.call(self, self.$t('plus.contactsReadFail'))
  })
}

export {
  plusAlert,
  takePhoto,
  appendByGallery,
  appendByCamera,
  readFileAndPressImg,
  upload,
  readContacts
}

/**
 *  需要初始化的plus方法
 * */
export function plusInit () {
  plusGoBack.call(this)
}
