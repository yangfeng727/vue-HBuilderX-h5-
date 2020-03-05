<!--生成二维码-->
<template>
  <div class="ScanPay-wrap">
    <header-nav :title="title" :noBg="true"></header-nav>
    <section class="layout-main-flex-content">
      <div class="content">
        <div class="box">
          <div class="top">
            <div class="lefp"><img src="../../assets/img/setting/default.png"/></div>
            <p>Profile name</p>
            <h1>Siraj Miah</h1>
          </div>
          <div class="bottom">
            <canvas id="qr-code" class="qr-code"></canvas>
            <!--<img class="qr-code" src="../../assets/img/receive/QR_code.png"/>-->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  import HeaderNav from '../../HeaderNav'
  import QRCode from 'qrcode'
  import {QRCodeType} from './qrcode'

  export default {
    name: 'ScanPay',
    components: {HeaderNav},
    data: function () {
      return {
        title: 'Scan To Pay Me'
      }
    },
    methods: {
      init () {
        let code = {type: QRCodeType[0], data: '11111'}
        QRCode.toCanvas(document.getElementById('qr-code'), JSON.stringify(code), {
          // width: domHide.offsetWidth,
          // height: domHide.offsetHeight,
          colorDark: '#000000',
          colorLight: '#ffffff',
          errorCorrectionLevel: 'H'
        }, (error) => {
          if (error) console.error(error)
          // console.log('success!')
        })
        //
        // let self = this
        // // svg
        // QRCode.toString('I am a pony!', {type: 'terminal'}, function (err, url) {
        //   console.log(url)
        //   self.url = url
        // })
        //
        // var opts = {
        //   errorCorrectionLevel: 'H',
        //   type: 'image/jpeg',
        //   quality: 0.3,
        //   margin: 1,
        //   color: {
        //     dark: '#010599FF',
        //     light: '#FFBF60FF'
        //   }
        // }
        //
        // // base64
        // QRCode.toDataURL('text', opts, function (err, url) {
        //   if (err) throw err
        //   self.url2 = url
        // })
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
<style scoped lang="less">
  /*@import "../../assets/css/index";*/

  /*溢出隐藏*/
  .font-elip {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ScanPay-wrap {
    background: linear-gradient(180deg, rgba(86, 204, 242, 1) 0%, rgba(162, 134, 245, 1) 100%);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;

    .layout-main-flex-content {
      padding: 0;
    }

    .content {
      padding: 0 30px;
      width: 100%;
    }

    .box {
      margin-top: -60px;
      background: #ffffff;
      border-radius: 14px;
      min-height: 300px;
      padding: 23px 23px;
    }

    .top {
      position: relative;
      box-sizing: border-box;
      padding: 9px 0 25px 62px;
      border-bottom: 1px solid #E3E3E3;
      text-align: left;
      line-height: 18px;

      .lefp {
        position: absolute;
        left: 0;
        width: 53px;
        height: 53px;
        overflow: hidden;
        border-radius: 50%;
        background: rgba(235, 250, 255, 1);
        top: 0;

        img {
          width: 100%;
        }
      }

      p {
        color: #9395AC;
        font-size: 11px;
      }

      h1 {
        color: #151422;
        font-size: 14px;
      }
    }

    .bottom {
      box-sizing: border-box;
      width: 100%;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;

      .qr-code{
        width: 256px !important;
        height: 256px !important;
      }
    }
  }
</style>
