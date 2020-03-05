<!--拍照上传证件-->
<template>
  <div class="ScanUpload-wrap">
    <div class="bg">
      <van-icon name="cross" @click="goBack()"/>
      {{$t('register.ScanUpload.title')}}
    </div>
    <section class="com-content">
      <div class="content">
        <div class="s-wrap">
          <img v-if="picture" class="imgShow" :src="picture">
          <img class="s-img" src="../../../assets/img/register/scan.png"/>
        </div>
        <div class="btn-tn">
          <van-button type="info" @click="appendByGallery()">{{$t('register.ScanUpload.Album')}}</van-button>
          <van-button type="info" @click="appendByCamera()">{{$t('register.ScanUpload.Photograph')}}</van-button>
        </div>
        <!--<p>path: {{picture}}</p>-->
      </div>
    </section>
    <footer>
      <p>{{$t('register.ScanUpload.Scan')}}
        <template v-if="identityType==='PASSPORT'">
          {{$t('register.ScanUpload.Passport')}}
        </template>
        <template v-else>
          {{$t('register.ScanUpload.IDCard')}}
        </template>
        {{$t('register.ScanUpload.Front')}}
      </p>
      <div class="com-btn-wrap">
        <van-button class="common-big-btn-nobg2" type="primary" size="large" @click="uploadBase64">
          {{$t('register.ScanUpload.complete')}}
        </van-button>
      </div>
      <!--<p>Step 1 of 2</p>-->
      <!--<p>Place your document within the frame until it is captured automatically</p>-->
    </footer>
  </div>
</template>
<script>
  export default {
    name: 'ScanUpload',
    data: function () {
      return {
        picture: '', // 拍照或者选择图片返回的图片本地路径（https访问不了，必须打包成app）
        mobile: '',
        identityType: this.$route.query.type
      }
    },
    methods: {
      /**
       *  上传文件（base64）
       * */
      uploadBase64 () {
        let self = this
        let path = this.picture
        let wt = plus.nativeUI.showWaiting() // 显示原生loading
        // 根据路径读取到文件
        plus.io.resolveLocalFileSystemURL(path, function (entry) {
          entry.file(function (file) {
            let fileReader = new plus.io.FileReader()
            fileReader.readAsDataURL(file)

            fileReader.onloadend = function (e) {
              wt.close()
              // let filename = f.replace(f.substring(0, f.lastIndexOf('/') + 1), '')
              // let param = {
              //   fileName: filename,
              //   dataInput: e.target.result.toString()
              // }
//               identityType选择项：
// PASSPORT(1),
//   IDENTITY_CARD(2),
              // 上传
              self.$httpPOST({
                url: self.$xhrConfig.setting.identityUpload,
                data: {
                  mobile: self.mobile,
                  identityType: self.identityType,
                  images: self.$base64Img(e.target.result.toString())
                }
              }).then((res) => {
                if (res.sus) {
                  self.showAlert(self.$t('register.ScanUpload.upSus'))
                  self.goBack()
                }
              }).catch((error) => {
                self.showAlert(self.$t('register.ScanUpload.upFail'))
                console.log(error)
              })
            }

            fileReader.onerror = function () {
              self.showAlert(self.$t('register.ScanUpload.msg'))
            }
          })
        })
      },
      /**
       * 上传文件（图片本身）
       * */
      upload (path) {
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
      },
      // 从相册添加文件
      appendByGallery () {
        let self = this
        plus.gallery.pick(function (path) {
          // console.log(path)
          self.picture = path
          // upload(path)
        })
      },
      // 调用手机摄像头并拍照
      appendByCamera () {
        let self = this
        let cmr = plus.camera.getCamera()
        let res = cmr.supportedImageResolutions[0]
        let fmt = cmr.supportedImageFormats[0]
        cmr.captureImage(function (p) {
          plus.io.resolveLocalFileSystemURL(p, function (entry) {
            // compressImage(entry.toLocalURL(), entry.name)
            // console.log('调用手机摄像头并拍照', entry)
            let path = entry.toLocalURL()
            self.picture = path
            // upload(path)
          }, function (e) {
            plus.nativeUI.toast(self.$t('register.ScanUpload.err') + e.message)
          })
        }, function (e) {
          // err
        }, {resolution: res, format: fmt})
      },
      getUserInfo (callback) {
        this.$httpGET({
          url: this.$xhrConfig.setting.getUserInfo
        }).then((res) => {
          if (res.sus && res.content) {
            let userProfile = res.content.userProfile
            this.mobile = userProfile.mobileNumber
            callback && callback(res)
          }
        })
      },
      init () {
        this.getUserInfo()
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
    }
  }
</script>
<style scoped lang="less">
  /*溢出隐藏*/
  .font-elip {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/ .van-icon-cross {
    font-size: 22px;
    position: absolute;
    top: 50%;
    margin-top: -11px;
    left: 18px;
  }

  .ScanUpload-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #E3E3E3;
  }

  .bg {
    background: url('../../../assets/img/setting/set_bg.png') no-repeat;
    height: 60px;
    width: 100%;
    font-size: 16px;
    color: #ffffff;
    font-weight: bold;
    line-height: 60px;
    position: relative;
  }

  .s-wrap {
    background: #ffffff;
    position: relative;
    width: 100%;
    height: 264px;
    box-sizing: border-box;
    padding: 10px;

    .imgShow {
      width: 100%;
      height: 100%;
    }

    .s-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .btn-tn {
    padding-top: 10px;
  }

  .com-content {
    /*padding-top: 111px;*/
    padding-top: 100px;
  }

  .com-btn-wrap {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  footer {
    /*margin-top: 66px;*/
    background: linear-gradient(90deg, rgba(86, 204, 242, 1) 0%, rgba(162, 134, 245, 1) 100%);
    /*height: 168px;*/
    padding-top: 19px;
    padding-bottom: 21px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    p {
      color: #ffffff;
      font-size: 13px;
    }

    p:nth-child(1) {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    p:nth-child(3) {
      box-sizing: border-box;
      padding: 34px 43px 0 43px;
    }
  }
</style>
