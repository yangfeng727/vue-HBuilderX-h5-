<template>
  <div class="PopupPicker">
    <field
      :class="{disabled:disabled}"
      disabled
      :value="getName"
      right-icon="arrow-down"
      :placeholder="placeholder"
      :error-message="errorMsg"
      @click="filedClick"
    />
    <Popup v-if="!disabled" v-model="showPicker" position="bottom">
      <Picker @cancel="showPicker = false" show-toolbar :columns="creatColumns" @confirm="onChange"></Picker>
    </Popup>
  </div>
</template>

<script>
  import {Picker, Popup, Icon, Field} from 'vant'

  export default {
    name: 'PopupPicker',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number],
        default: ''
      },
      columns: {
        type: Object,
        default: function () {
          return {}
        }
      },
      errorMsg: { // 错误提示
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showPicker: false
      }
    },
    components: {Picker, Popup, Icon, Field},
    computed: {
      /**
       *  格式转换
       *  vant组件原因这里将{1:'$'}  =》 [{text:'$',value:1}]
       * */
      creatColumns () {
        let arr = []
        for (let key in this.columns) {
          arr.push({text: this.columns[key], value: key})
        }
        return arr
      },
      getName () {
        return this.$getObjVal(this.columns, this.value)
      }
    },
    methods: {
      onChange (value) {
        this.$emit('update:value', value.value)
        this.showPicker = false
      },
      /**
       *  错误提示赋值
       * */
      setErrorMsg (str = '') {
        // this.errorMsg = str
      },
      filedClick () {
        this.showPicker = true
        // this.setErrorMsg()
      }
    }
  }
</script>

<style scoped lang="less">
  .PopupPicker {
    .disabled {
      background: #eeeeee;
    }

    /deep/ .van-cell {
      border: 1px solid #dcdcdc;
    }

    /deep/ .van-field__right-icon .van-icon {
      font-size: 12px;
    }

    /deep/ .van-picker .van-picker__toolbar {
      padding: 0px 20px;
    }

    /deep/ .van-picker .van-picker__toolbar button {
      padding: 13px 20px;
      border: 1px solid #7c98fe;
      line-height: 0px;
      color: #55a3fe;
      border-radius: 15px;
      margin: 8px 10px;
    }

    /deep/ .van-picker .van-picker__toolbar .van-picker__confirm {
      background: -webkit-linear-gradient(#459cfd, #8197ff); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#459cfd, #8197ff); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#459cfd, #8197ff); /* Firefox 3.6 - 15 */
      background: linear-gradient(#459cfd, #8197ff); /* 标准的语法 */
      color: #ffffff
    }
  }
</style>
