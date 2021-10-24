// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_contribute').where({
    title: event.title,
    articleContent: event.articleContent,
    name: event.name,
    stuNum: event.stuNum,
    time: event.time,
    images: event.images
  }).update({
    data: {
      status: event.status
    }
  })
}