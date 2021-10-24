// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_organization').add({
    data: {
      stuNum: event.stuNum,
      activityName: event.activityName,
      place: event.place,
      time: event.time,
      type: event.type,
      teamName: event.teamName,
      number: event.number,
      principal: event.principal,
      adviser: event.adviser,
      uploadFile: event.uploadFile, 
      noteInfo: event.noteInfo,
      status: event.status
    }
  })
}