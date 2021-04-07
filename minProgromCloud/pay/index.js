// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"data-base-1g3n115z3df553d0"
});
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "电车搭乘",
    "outTradeNo" : event.outTradeNo,
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1604371057",
    "totalFee" : 1,
    "envId": "data-base-1g3n115z3df553d0",
    "functionName": "pay_cb"
  })
  return res
}