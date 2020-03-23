<template>
  <div>
    HelloWorld
    <h1>下拉组件</h1>
    <popup-picker placeholder="请选择"
                  class="pop-cu-item"
                  :value.sync="model.currencyType"
                  :columns="currencyTypeMap"
                  :errorMsg="errorMsg.currencyType"></popup-picker>
  </div>
</template>
<script>
  import PopupPicker from './common/PopupPicker'

  export default {
    name: 'HelloWorld',
    components: {PopupPicker},
    data: function () {
      return {
        title: 'HelloWorld',
        model: {
          currencyType: ''
        },
        errorMsg: {
          currencyType: ''
        },
        currencyTypeMap: {
          1: 'dddd',
          2: 'aaaa'
        }
      }
    },
    created () {
      /**
       *  判断当前用户是否登陆
       * */
      this.$httpGET({
        url: this.$xhrConfig.test.testUrl
        // data: {
        //   yy: '顶顶顶顶顶顶顶'
        // }
        // offLoad: false, // 关闭loading
        // offMsg: false, // 关闭错误提示弹窗
        // checkLogin: false // 关闭登陆验证
      }).then((res) => {
        console.log(res, 1111111)
      })
    }
  }
</script>
<style scoped lang="less">
  /*.pop-cu-item {*/
    /*/deep/ .van-field {*/
      /*padding: 0;*/
    /*}*/

    /*/deep/ .van-field__control:disabled {*/
      /*color: #323233;*/
    /*}*/

    /*/deep/ .van-cell {*/
      /*border: none;*/
    /*}*/

    /*/deep/ .van-field__control {*/
      /*box-sizing: border-box;*/
      /*padding-left: 0;*/
    /*}*/

    /*/deep/ .van-cell:not(:last-child)::after {*/
      /*border: none;*/
    /*}*/

    /*/deep/ .van-field__right-icon {*/
      /*margin-right: 8px;*/
      /*color: #666666;*/
    /*}*/
  /*}*/
</style>
