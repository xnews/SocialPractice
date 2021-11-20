// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_topic').add({
    data: {
      user_name: event.user_name,
      user_img_url: event.user_img_url,
      title: event.title,
      img_url: event.img_url,
      content: event.content
    }
  })
}