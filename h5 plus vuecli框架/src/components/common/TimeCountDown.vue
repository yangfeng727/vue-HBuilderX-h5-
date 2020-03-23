<template>
  <p>{{timeObj.days}} {{$t('day')}} {{timeObj.hours}}:{{timeObj.minutes}}:{{timeObj.seconds}}</p>
</template>

<script>
import moment from 'moment'

export default {
  name: 'TimeCountDown',
  props: {
    // 展示类型
    type: {
      type: String,
      default: 'default'
    },
    // 默认不显示天数
    isShowDays: {
      type: Boolean,
      default: true
    },
    // 结束日期
    endDate: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      timeObj: {
        days: '',
        hours: '',
        minutes: '',
        seconds: ''
      },
      timer: null
    }
  },
  created () {
  },
  mounted () {
    // 当前本地日期
    let currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
    this.timeObj = this.calcDate(currentDate, this.endDate)
    this.countDown()
  },
  methods: {
    /**
     * @description 计算日期时间差
     * @param beginDate 开始日期
     * @param endDate 结束日期
     * @return {Object} 日期对象
     */
    calcDate (beginDate, endDate) {
      let endTime = moment(endDate)
      let beginTime = moment(beginDate)
      const diff = endTime.diff(beginTime)
      const diffDuration = moment.duration(diff)
      if (diff <= 0) {
        return {
          diff: 0, // 时间戳
          days: '0',
          hours: '00',
          minutes: '00',
          seconds: '00',
          toString: function () {
            return '00:00:00'
          }
        }
      }

      let self = this
      let m = {
        diff: diff, // 时间戳
        days: `${parseInt(diffDuration.asDays(), 10)}`,
        hours: self.addPrefix(`${parseInt(diffDuration.asHours() % 24, 10)}`),
        minutes: self.addPrefix(`${(parseInt(diffDuration.asMinutes()) % 60)}`),
        seconds: self.addPrefix(`${parseInt(diffDuration.asSeconds()) % 60}`),
        toString: function () {
          return self.isShowDays ? `${this.days} ${this.hours}:${this.minutes}:${this.seconds}` : `${this.hours}:${this.minutes}:${this.seconds}`
        }
      }
      return m
    },
    /**
     * @description 倒计时 天时分秒 计算
     * @param unix 时间戳
     */
    formatTime (unix) {
      var t = null
      var d = null
      var h = null
      var m = null
      var s = null
      // js默认时间戳为毫秒,需要转化成秒
      t = unix / 1000
      // d = Math.floor(t / (24 * 3600));
      if (t > 0) {
        d = this.isShowDays ? Math.floor(t / (24 * 3600)) : 0
        h = Math.floor((t - 24 * 3600 * d) / 3600)
        m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60)
        s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60))
      } else {
        d = h = m = s = 0
      }
      h = h < 10 ? `0${h}` : `${h}`
      m = m < 10 ? `0${m}` : `${m}`
      s = s < 10 ? `0${s}` : `${s}`
      d = d > 1 ? `${d}` : `${d}`
      return {d, h, m, s}
    },
    /**
     * @description 倒计时
     */
    countDown () {
      this.timer = setInterval(() => {
        this.timeObj.diff -= 1000
        let obj = this.formatTime(this.timeObj.diff)
        this.timeObj.days = obj.d
        this.timeObj.hours = obj.h
        this.timeObj.minutes = obj.m
        this.timeObj.seconds = obj.s
        if (this.timeObj.diff <= 0) clearInterval(this.timer)
      }, 1000)
    },
    addPrefix (num) {
      num = num < 10 ? `0${num}` : `${num}`
      return num
    }
  },
  beforeDestroy () {
    // 组件销毁时 清除定时器
    clearInterval(this.timer)
  }
}
</script>

<style scoped>

</style>
