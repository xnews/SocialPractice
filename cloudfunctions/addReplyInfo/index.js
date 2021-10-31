// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('activity_comment').doc(event.id).update({
      data: {
        detail: [{
          replyInfo: _.push(event.replyInfo)
        }]
      }
    })
  } catch (error) {
    console.log(error)
  }
}