// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('operation_logs').add({
    data: {
      intoId: event.intoId,
      upTime: event.upTime,
      userToken: event.userToken,
      userTrajectoryArr: event.userTrajectoryArr
    }
  })
}