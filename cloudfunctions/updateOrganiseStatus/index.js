// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_organization').where({
    activityName: event.activityName,
    adviser: event.adviser,
    noteInfo: event.noteInfo,
    number: event.number,
    place: event.place,
    principal: event.principal,
    teamName: event.teamName,
    time: event.time,
    type: event.type,
    uploadFile: event.uploadFile
  }).update({
    data: {
      status: event.status
    }
  })
}