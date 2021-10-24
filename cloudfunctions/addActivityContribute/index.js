// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_contribute').add({
    data: {
      stuNum: event.stuNum,
      name: event.name,
      time: event.time,
      title: event.title,
      articleContent: event.articleContent,
      images: event.images,
      status: "审核中"
    }
  })
}