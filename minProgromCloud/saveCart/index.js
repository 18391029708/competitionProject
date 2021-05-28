// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = cloud.database().command
  return cloud.database().collection('user')
    .doc(event._id)
    .update({
      data:{
        cart:_.push(event.cart)  
      }
    })
}