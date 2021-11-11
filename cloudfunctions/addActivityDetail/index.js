// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_detail').add({
    data: {
      activityName: event.activityName,
      certification: event.certification,
      deadline: event.deadline,
      heat: event.heat,
      manager: event.manager,
      site: event.site,
      teacher: event.teacher,
      time: event.time,
      type: event.type
    }
  })
}