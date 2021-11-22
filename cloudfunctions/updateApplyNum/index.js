// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activity_detail').where({
    _id: event._id
  }).update({
    data: {
      particular: {
        apply: _.inc(event.applyNum)
      }
    }
  })
}