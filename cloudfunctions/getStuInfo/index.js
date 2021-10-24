// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) 
const db = cloud.database()
const _ = db.command
// 云函数入口函数
// 获取学生学号
exports.main = async (event, context) => {
  try {
    return await db.collection("stuInfo")
    .where({
      stuNum: _.eq(event.stuNum)
    })
    .limit(50)
    .get()
  } catch (error) {
    console.error
  }

}