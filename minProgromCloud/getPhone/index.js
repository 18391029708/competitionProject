// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"data-base-1g3n115z3df553d0"
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  const res = await cloud.getOpenData({
    list:event.coloudID,
  })
  console.log('云函数返回值', res)

  return{
    res
  } 
}