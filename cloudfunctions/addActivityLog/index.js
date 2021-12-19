// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_log').add({
    data: {
      activityId: event.activityId,
      stuNum: event.stuNum,
      stuName: event.stuName,
      signInTime: event.signInTime,
      signInSite: event.signInSite,
      signBackTime: event.signBackTime,
      signBackSite: event.signBackSite
    }
  })
}