// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"data-base-1g3n115z3df553d0"
});
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  //集合数据增加操作
  var opr = event.opr;
  if (opr == 'add') {
    //参数列表: 集合名 上传的数据对象
    try {
      return await db.collection(event.tablename).add({
        data: event.data
      })
    } catch (e) {
      console.error(e)
    }
  } else if (opr == 'del') {
    //参数列表: 集合名 删除的元素docid
    // console.log(typeof event.docid == 'undefined')

    //条件删除有一些问题 需要修改测试一下下
    //console.log(event.belongs)
    console.log(event.id)
    try {
      return await db.collection(event.tablename).doc(event.id).remove()
    } catch (e) {
      console.error(e)
    }
  }
  else if (opr == 'query') {
    //参数列表: 集合名 删除的元素docid
    // console.log(typeof event.docid == 'undefined')

    //条件删除有一些问题 需要修改测试一下下
    //console.log(event.belongs)
    console.log(event.id)
    try {
      return await db.collection(event.tablename).where(event.data).get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}