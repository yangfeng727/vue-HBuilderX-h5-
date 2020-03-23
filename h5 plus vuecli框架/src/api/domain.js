/**
 *  域名配置文件
 * */
let domain = window.location.protocol + '//' + window.location.host // 域名
export default {
  // otherDomain: process.env.NODE_ENV === 'production' ? 'http://192.168.0.1:8080' : 'http://192.168.0.2:8181',
  domain
}
