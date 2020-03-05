<!--二维码扫码-->
<template>
  <div class="ScanQRCode-wrap">
    <h1 class="top">{{title}}</h1>
    <!--<div class="bg"></div> -->
    <div class="content" id="scanContainer">
      <div class="box">
        <!-- <p class="p1">Scan recipient's QR code to send money</p> -->
        <!-- <div class="frame" id="frame"></div> -->
        <!-- <p class="p2">Position the QR Code within the frame</p> -->
        <p class="tip">
          <template v-if="load">...loading...</template>
          <template v-else>...parsing...</template>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ScanQRCode',
    props: {
      scanSus: { // 扫码成功后的回调
        type: Function,
        default: null
      }
    },
    data () {
      return {
        title: 'Scan QR Code',
        load: true,
        scan: null,
        textViewObj: {} // view
      }
    },
    methods: {
      // 创建原生View控件
      createTextView () {
        this.textViewObj['p1'] = new plus.nativeObj.View('test', {
            // backgroundColor: 'rgba(0, 0, 0, 0.45)',
            top: '148px',
            left: '5%',
            height: '35px',
            width: '90%'
          },
          [{
            tag: 'rect',
            id: 'rect',
            rectStyles: {
              radius: '21px',
              color: 'rgba(0, 0, 0, 0.45)'
            }
          }, {
            tag: 'font',
            id: 'font',
            text: 'Scan recipient\'s QR code to send money',
            textStyles: {
              color: '#FFFFFF',
              size: '13px',
              align: 'center'
            }
          }])

        this.textViewObj['p2'] = new plus.nativeObj.View('test', {
            // backgroundColor: '#56ccf2',
            bottom: '100px',
            left: '5%',
            height: '35px',
            width: '90%'
          },
          [{
            tag: 'rect',
            id: 'rect',
            rectStyles: {
              radius: '8px',
              color: '#56ccf2'
            }
          }, {
            tag: 'font',
            id: 'font',
            text: 'Scan recipient\'s QR code to send money',
            textStyles: {
              color: '#FFFFFF',
              size: '13px',
              align: 'center'
            }
          }])

        this.textViewObj['p1'].show()
        this.textViewObj['p2'].show()
      },
      // 打开闪光灯
      openLight () {
        this.isLight = !this.isLight
        this.scan.setFlash(this.isLight)
      },
      startRecognize () {
        this.scan = null
        let self = this
        // 扫描二维码
        this.scan = new plus.barcode.Barcode('scanContainer',
          [plus.barcode.QR], {
            frameColor: '#1294cb',
            scanbarColor: '#1294cb'
            // top: '0',
            // left: '5%',
            // width: '100%',
            // height: '100px'
            // position: 'fixed'
          })
        this.scan.onmarked = function (type, code, file) {
          this.load = false
          console.log('扫码成功', type, code, file, 444)
          let text = ''
          switch (type) {
            case plus.barcode.QR:
              text = 'QR'
              break
            case plus.barcode.EAN13:
              text = 'EAN13'
              break
            case plus.barcode.EAN8:
              text = 'EAN8'
              break
          }
          self.scanSus && self.scanSus(text, code, file)
          // result = result.replace(/\n/g, '')
          // that.storage.save('cameraData', result)
          // if (plus.webview.all().length > 1) {
          //   // 扫码成功后关闭当前的webview
          //   let ws = plus.webview.currentWebview()
          //   plus.webview.close(ws)
          // }
        }
      },
      // 开始扫描
      startScan () {
        if (!window.plus) return
        this.startRecognize() // 创建控件
        setTimeout(() => {
          this.scan.start()
          // this.scan.start({ // 可以配置扫描后保存的路径
          //   conserve: true,
          //   filename: '_doc/barcode/'
          // })
        }, 200)
      },
      // // 取消扫描
      // cancelScan () {
      //   let l = plus.webview.all().length
      //   if (l > 1) {
      //     let ws = plus.webview.currentWebview()
      //     plus.webview.close(ws)
      //   } else {
      //     this.$router.go(-1)
      //   }
      //   // this.$router.go(-1);
      //   if (!window.plus) return
      //   plus.navigator.setStatusBarStyle('dark')
      //   if (scan) {
      //     scan.cancel() // 关闭扫描
      //     scan.close() // 关闭条码识别控件
      //   }
      // },
      // // 从相册选择图片扫码
      // getPicture () {
      //   plus.gallery.pick(src => {
      //     plus.barcode.scan(
      //       src,
      //       (type, result) => {
      //         scan.cancel()
      //         scan.close()
      //         this.storage.save('cameraData', result)
      //         if (plus.webview.all().length > 1) {
      //           // 扫码成功后关闭当前的webview
      //           let ws = plus.webview.currentWebview()
      //           plus.webview.close(ws)
      //         }
      //       },
      //       error => {
      //         this.$toast({
      //           position: 'bottom',
      //           message: error.message
      //         })
      //       }
      //     )
      //   })
      // },
      init () {
        setTimeout(() => {
          // 设置500毫秒等资源加载
          if (window.plus) {
            // let s = plus.navigator.checkPermission('camera')
            // if (s !== 'notdeny') {
            //   plus.nativeUI.alert('相机权限未获取，请往设置应用程序里面开启权限!')
            //   return
            // }
            this.createTextView()
            this.startScan() // 进入页面就调取扫一扫
          }
        }, 500)
      }
    },
    mounted () {
      if (window.plus) {
        this.init()
      } else {
        document.addEventListener('plusready', this.init, false)
      }
    },
    beforeDestroy () {
      document.removeEventListener('plusready', this.init, false)
      // 移除扫码
      if (!window.plus) return
      this.scan.cancel()
      this.scan.close()
      // 移除view
      for (let x in this.textViewObj) {
        this.textViewObj[x].close()
      }
    }
  }
</script>
<style scoped lang="less">
  .ScanQRCode-wrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    .top {
      background: url("../../assets/img/setting/set_bg.png") no-repeat;
      background-size: cover;
      color: #FFFFFF;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }

    @navHeight: 60px;

    .bg {
      position: absolute;
      left: 0;
      top: @navHeight;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: url("../../assets/img/contacts/scan_bg.png") no-repeat center;
    }

    .content {
      background: #000000;
      position: absolute;
      left: 0;
      top: @navHeight;
      bottom: 0;
      right: 0;
      z-index: 1;
      padding: 0 33px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .box {
        width: 100%;
        position: relative;
        z-index: 555;
      }

      p {
        color: #ffffff;
        font-size: 13px;
        text-align: center;
        line-height: 34px;
      }

      .p1 {
        background: rgba(0, 0, 0, 0.45);
        border-radius: 21px;
      }

      .p2 {
        background: rgba(86, 204, 242, 1);
        border-radius: 5px;
      }

      .frame {
        border: 2px solid rgba(86, 204, 242, 1);
        width: 100%;
        height: 224px;
        margin-top: 16px;
        margin-bottom: 24px;
      }
    }

    .tip {
      color: #ffffff;
      font-weight: bold;
      text-shadow: 0px -1px #103E5C;
    }
  }
</style>
