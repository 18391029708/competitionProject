// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"data-base-1g3n115z3df553d0"
})

// 云函数入口函数
exports.main = async (event, context) => {
  //获取openid
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

 return cloud.database().collection('t_lost_record')
  .where({
    type:event.type
  })
  .get()
}