// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  try {
    return await db.collection('activity_detail').where({
      type: event.type
    }).get()
  } catch (error) {
    console.log(error)
  }
}