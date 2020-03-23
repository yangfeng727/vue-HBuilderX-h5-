// 二维码是什么类型的数据
let QRCodeType = [
  'personInfo' // 个人信息
]

/**
 *  解析二维码,统一处理
 * */
function getCodeVal (code) {
  if (!code.type) return code
  switch (code.type) {
    case QRCodeType[0]:
      return code.data
    default:
      return code
  }
}

export {
  QRCodeType,
  getCodeVal
}
