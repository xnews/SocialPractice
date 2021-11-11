// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_dynamic').add({
    data: {
      img_url: event.img_url,
      time: event.time,
      title: event.title,
      type: event.type,
      content: event.content,
    }
  })
}