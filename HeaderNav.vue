<template>
  <div class="header-wrap">
    <nav-bar
      :class="{'no-bg':noBg,'blue':blue}"
      :title="title"
      left-text=""
      right-text=""
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template slot="left">
        <slot name="left">
          <span class="s-back"></span>
        </slot>
      </template>
      <template slot="right">
        <slot name="right"></slot>
      </template>
    </nav-bar>
  </div>
</template>
<script>
  import {NavBar} from 'vant'

  export default {
    name: 'HeaderNav',
    components: {NavBar},
    props: {
      title: '',
      noBg: false, // 不显示背景
      blue: false, // 不显示背景
      to: { // 页面name
        type: [String, Object],
        default: null
      }
    },
    data: function () {
      return {}
    },
    methods: {
      onClickLeft () {
        this.goBack(this.to)
      },
      onClickRight () {
        // Toast('按钮')
      }
    },
    created () {
      if (this.to) window.plus_back_path = this.to
    }
  }
</script>
<style scoped lang="less">
  .header-wrap {
    position: fixed;
    z-index: 5;
    width: 100%;

    /deep/ [class*=van-hairline]::after {
      border: none
    }

    /deep/ .van-nav-bar {
      background: url("../../assets/img/setting/set_bg.png") no-repeat;
      background-size: cover;
      height: 60px;
      line-height: 60px;

      &.no-bg {
        background: transparent;
      }

      &.blue {
        background: transparent;
        background-color: #2F80ED;
      }
    }

    /deep/ .van-nav-bar__title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }

    /deep/ .van-nav-bar__left {
      left: 18px;
      top: 18px;
    }

    /deep/ .van-nav-bar__right {
      right: 18px;
      top: 18px;
    }

    /*左侧返回按钮*/

    .s-back {
      display: block;
      text-decoration: none;
      width: 18px;
      height: 18px;
      background: url("../../assets/img/icon/arrow-back.png") no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
