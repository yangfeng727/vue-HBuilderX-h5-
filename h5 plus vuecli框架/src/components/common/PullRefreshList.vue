<!--列表下拉刷新及向下分页加载组件-->
<template>
  <div class="pull-list-wrap">
    <pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      :pulling-text="`${$t('common.PullRefreshList.pullDownRefresh')}...`"
      :loosing-text="`${$t('common.PullRefreshList.releaseRefresh')}...`"
      :loading-text="`${$t('common.PullRefreshList.loading')}...`"
    >
      <list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        :finished-text="$t('common.PullRefreshList.noMore')"
        @load="getList"
      >
        <p class="no-data" v-if="!datalist.length">{{$t('common.PullRefreshList.noData')}}</p>
        <!--列表-->
        <template v-else v-for="(item,index) in datalist">
          <slot name="list" :item="item" :key="index"></slot>
        </template>
      </list>
    </pull-refresh>
  </div>
</template>

<script>
  import {List, PullRefresh} from 'vant'

  export default {
    name: 'PullRefreshList',
    components: {
      List,
      PullRefresh
    },
    props: {
      fatherMethod: { // 用于处理请求后的list数据，并返回list
        type: Function,
        default: null
      },
      url: { // 请求地址
        type: String,
        default: ''
      },
      param: { // 参数
        type: Object,
        default () {
          return {}
        }
      },
      checkLogin: { // 是否验证登陆，并强制跳转到登陆页
        type: Boolean,
        default: true
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    data () {
      return {
        pageNum: 1,
        datalist: [],
        isPullLoading: false, // 下拉刷新
        loading: false,
        finished: false
      }
    },
    methods: {
      /**
       *  请求
       * */
      getData (callback) {
        this.$httpGET({
          url: this.url,
          data: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            ...this.param
          },
          offLoad: false, // 关闭
          checkLogin: this.checkLogin // 关闭登陆验证
        }).then((res) => {
          if (res.content && res.content.pageInfo && res.content.pageInfo.list) {
            let pageInfo = res.content.pageInfo
            // 使用父组件指定的数据处理方法
            let list = this.fatherMethod ? this.fatherMethod(res.content) : pageInfo.list
            callback && callback(list, pageInfo)
          } else { // 无数据
            // this.$toast('刷新成功')
            this.isPullLoading = false
            this.loading = false
          }
        })
      },
      /**
       *  是否显示 “没有更多”
       * */
      isShowMore (pageInfo) {
        if (this.datalist.length >= parseInt(pageInfo.total) && this.datalist.length !== 0) {
          this.finished = true
        } else {
          this.finished = false
        }
      },
      /**
       *  刷新
       * */
      onRefresh (showAlert = false) {
        this.pageNum = 1
        this.getData((list, pageInfo) => {
          setTimeout(() => {
            !showAlert && this.$toast(this.$t('common.PullRefreshList.refreshSus'))
            // 加载完成
            this.isPullLoading = false
            this.datalist = list

            // 允许分页加载
            this.isShowMore(pageInfo)
          }, 500)
        })
      },
      /**
       *  向下分页
       * */
      getList () {
        this.getData((list, pageInfo) => {
          let arr = []
          if (this.pageNum === 1) {
            arr = list
          } else {
            arr = this.datalist.concat(list)
          }
          this.datalist = arr
          // pageNum加1,下次请求下一页
          this.pageNum += 1
          // 加载状态结束
          this.loading = false
          // 所有数据加载完成

          // 允许分页加载
          this.isShowMore(pageInfo)
        })
      }
    },
    created () {
      this.getList()
    }
  }
</script>

<style scoped>
  /*.pull-list-wrap /deep/ .van-pull-refresh{*/
  /*min-height:00px;*/
  /*}*/
  .no-data {
    color: #969799;
    font-size: 13px;
    line-height: 50px;
    text-align: center;
  }
</style>
