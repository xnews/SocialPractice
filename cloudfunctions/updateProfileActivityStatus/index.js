// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('profile_activity_info').where({
      stuNum: event.stuNum,
      activity: {
        _id: event._id
      }
  }).update({
    data: {
      'activity.$.status': event.status
    }
  })
  } catch (error) {
    console.log(error)
  }
}