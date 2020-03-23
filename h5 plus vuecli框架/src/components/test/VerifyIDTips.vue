<template>
  <div class="VerifyIDTips-wrap">
    <header-nav :title="title"/>
    <section class="com-content">
      <p class="text">Please ensure that the information on the identity card is clear and visible.</p>
      <div class="top">
        <img src="../../assets/img/verify/id1.png"/>
      </div>
      <div class="bottom">
        <h1>Unacceptable examples</h1>
        <div class="flex-box">
          <div>
            <img src="../../assets/img/verify/id2.png"/>
            <p>Reflective spot</p>
          </div>
          <div>
            <img src="../../assets/img/verify/id3.png"/>
            <p>Illegible</p>
          </div>
          <div>
            <img src="../../assets/img/verify/id4.png"/>
            <p>Key info blocked</p>
          </div>
        </div>
      </div>
      <div class="com-btn-wrap">
        <van-button class="common-big-btn" type="primary" size="large" @click="next">Take Photo</van-button>
      </div>
    </section>
  </div>
</template>
<script>
  import HeaderNav from '../common/HeaderNav'
  import {takePhoto} from '../../plus/plus'

  export default {
    name: 'VerifyIDTips',
    components: {HeaderNav},
    data: function () {
      return {
        title: 'Identity verifications'
      }
    },
    methods: {
      next () {
        takePhoto.call(this, (path) => {
          if (!path) {
            this.$toast(this.$t('verification.failRead'))
          } else {
            this.$router.push({name: 'scanUpload', query: {...this.$route.query, path}})
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .VerifyIDTips-wrap {
    text-align: left;

    .text {
      padding: 14px 16px;
      font-size: 13px;
      color: #1E1E1E;
    }

    .top {
      padding: 4px 0 8px 0;
      background: #ffffff;
      text-align: center;

      img {
        width: 327px;
        height: auto;
      }
    }

    .bottom {
      margin-top: 11px;
      background: #ffffff;
      padding: 15px 19px 29px 19px;

      h1 {
        font-size: 14px;
        margin-bottom: 12px;
      }

      .flex-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;

        img {
          width: 78px;
          height: auto;
          margin-bottom: 17px;
        }

        p {
          text-align: center;
          font-size: 11px;
        }
      }
    }

    .com-btn-wrap {
      padding: 37px 21px 14px 21px;
    }
  }
</style>
