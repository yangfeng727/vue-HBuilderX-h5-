<!--Contacts-->
<template>
  <div class="Contacts-wrap">
    <search placeholder="Search"
            v-model="search"
            right-icon="search"
            left-icon=""
            shape="round"
            style="padding:0;"
            class="com-search"
            background="transparent"
            @input="searchInput"
    >
      <template slot="right-icon">
        <van-icon name="scan" @click="showScan=true"/>
        <van-icon name="search" @click="searchContact"/>
      </template>
    </search>
    <contact-item v-if="!search" :pLick="pLick" :contactListPhone="contactListPhone"/>
    <!--搜索列表-->
    <template v-else>
      <p class="found" v-if="searchList.length>0">{{searchList.length}} contacts found</p>
      <contact-item :pLick="pLick" :contactListPhone="searchList"/>
    </template>
    <!--扫一扫-->
    <popup
      class="com-popup-box"
      v-model="showScan"
      position="right"
      closeable
      :close-icon="$getImg('close','img/icon/')"
      :style="{ height: '100%',width:'100%' }"
    >
      <scan-q-r-code v-if="showScan" :scanSus="scanSus"/>
    </popup>
  </div>
</template>
<script>
  import {Search, Popup} from 'vant'
  import ContactItem from './ContactItem'
  import ScanQRCode from './ScanQRCode'
  import contactGL from './contactGL' // 本地数据控制
  import {getCodeVal} from '../../plus/qrcode'
  import {readContacts} from '../../plus/plus'

  export default {
    name: 'Contacts',
    components: {Search, Popup, ContactItem, ScanQRCode},
    props: {
      pLick: { // 点击联系人事件
        type: Function,
        default: null
      }
    },
    data () {
      return {
        showScan: false, // 扫一扫
        contactListPhone: [], // 手机联系人列表
        search: '',
        searchList: [] // 搜索出来的数据
      }
    },
    computed: {
      // contactList () {
      //   return this.contactListPhone.concat(this.contactListSIM)
      // }
    },
    methods: {
      /**
       *  二维码扫码成功后的方法
       * */
      scanSus (type, code, file) {
        this.showScan = false
        let codeInfo = getCodeVal(JSON.parse(code))
        if (type === 'QR' && codeInfo) {
          this.showAlert(codeInfo)
        } else {
          this.showAlert('QR code identification error')
        }
      },
      /**
       *  本地查找匹配
       * */
      searchInput (val) {
        // console.log(val)
        this.searchList = this.contactListPhone.filter(item => {
          return item.key.indexOf(val) > -1 || item.firstName.indexOf(val) > -1 || item.lastName.indexOf(val) > -1
        })
      },
      /**
       *  搜索联系人
       *  @accountId (可选，二维码信息)
       * */
      searchContact (e, accountId) {
        let data = {
          accountId: '', // 二维码里面的信息
          mobileNumber: '',
          email: ''
        }
        if (!accountId) {
          let str = this.search
          if (/^\+?(\d)+$/g.test(str)) {
            // 电话
            data.mobileNumber = str
          } else if (/^([0-9A-Za-z\-_.]+)@$/g.test(str) || this.$isEmail(str)) {
            // email
            data.email = str
          } else {
            // name
            data.accountId = str
          }
        } else {
          data.accountId = accountId
        }
        this.$httpGET({
          url: this.$xhrConfig.contact.search,
          data
        }).then((res) => {
          if (res.sus && res.content) {
            this.showAlert('success！')
            this.searchList = res.content
          }
        }).catch((error) => {
          this.showAlert('搜索失败！')
          console.log(error)
          this.searchList = []
        })
      },
      /**
       *  同步本地联系人到数据库
       *  @arr 查询到的手机联系人信息
       * */
      syncPhoneContacts (arr = []) {
        let dataArr = arr.map((item) => {
          return {
            mobileNumbers: item.mobileNumbers,
            emails: item.emails,
            firstName: item.name, // 名称
            lastName: '' // 姓名
            // firstName: item.firstName, // 名称
            // lastName: item.lastName // 姓名
          }
        })
        // console.log('手机通讯录数据', dataArr)
        // 测试数据
        // dataArr = [{
        //   'emails': ['abc@qq.com', 'def@baidu.com'],
        //   'firstName': 'fff',
        //   'lastName': 'lll',
        //   'mobileNumbers': ['+8615902316800', '+60159023168']
        // }, {
        //   'emails': ['abc2@qq.com', 'def2@baidu.com'],
        //   'firstName': 'fff2',
        //   'lastName': 'lll2',
        //   'mobileNumbers': ['+8615902316802', '+60159023162']
        // }]
        this.$httpPOST({
          url: this.$xhrConfig.contact.syncPhoneContacts,
          data: {
            'json': JSON.stringify(dataArr)
          }
        }).then((res) => {
          // alert(JSON.stringify(res.content))
          if (res.sus && res.content) {
            // console.log('scuuess', res)
            let list = res.content.map(item => {
              return {
                ...item,
                key: contactGL.creatKey(item) // 创建key
              }
            })
            this.contactListPhone = list
            contactGL.saveContacts(this.contactListPhone)
            this.showAlert('通讯录同步成功！')
            // this.$router.push({name: 'successChangePassword'})
          }
        }).catch((error) => {
          this.showAlert('通讯录同步失败！')
          console.log(error)
          this.contactListPhone = []
        })
      },
      /**
       *  获取手机通讯录，并同步到数据库
       * */
      getContactWithPlus () {
        // let s = plus.navigator.checkPermission('CONTACTS')
        // if (s !== 'notdeny') {
        //   plus.nativeUI.alert('联系人权限未获取，请往设置应用程序里面开启权限!')
        //   return
        // }
        if (!window.plus) return
        let self = this
        readContacts.call(this, (arr) => {
          self.syncPhoneContacts(arr) // 将联系人同步到数据库
        })
      },
      /**
       *  初始化页面
       * */
      init () {
        let contactList = contactGL.getContacts()
        if (contactList) {
          this.contactListPhone = contactList
        } else {
          // 同步本地数据
          this.getContactWithPlus()
        }
      }
    },
    mounted () {
      // this.syncPhoneContacts()
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
  /*@import "../../assets/css/index";*/

  /*溢出隐藏*/
  .font-elip {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Contacts-wrap {
    .found {
      text-align: left;
      padding: 8px 0;
      color: #9395AC;
      font-size: 12px;
      border-bottom: 1px solid rgba(147, 149, 172, 0.5);
    }
  }
</style>
