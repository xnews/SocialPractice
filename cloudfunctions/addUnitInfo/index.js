// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('unitInfo').add({
    data: {
      name: event.name,
      nature: event.nature,
      industry: event.industry,
      contact: event.contact,
      abutment: event.abutment,
      email: event.email,
      address: event.address,
      applicant: [],
      status: 0
    }
  })
}