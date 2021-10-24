// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('profile_activity_info').add({
    data: {
      activity: event.activity,
      organization: event.organization,
      collection: event.collection,
      practiceTime: event.practiceTime,
      name: event.name,
      stuNum: event.stuNum,
      openId: event.openId
    }
  })
}