// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const xlsx = require('node-xlsx');   //导入Excel类库
const db = cloud.database()   //声明数据库对象
const _ = db.command
exports.main = async (event, context) => {   //主函数入口
    try {
        let feedBackInfo = event.data;
        // const feedBackInfo = [{stuNum:'20180304101',name:'张三',professial:'计算机科学与技术',practiceTime:1000000,rank:1}]
        console.log(feedBackInfo);
        let dataCVS = `feedBackInfo-${Math.floor(Math.random()*100000)}.xlsx`
        //声明一个Excel表，表的名字用随机数产生
        let alldata = [];
        let row = ['活动名称','反馈类型', '反馈内容','反馈人','联系方式','时间']; //表格的属性，也就是表头说明对象
        alldata.push(row);  //将此行数据添加到一个向表格中存数据的数组中
//接下来是通过循环将数据存到向表格中存数据的数组中
        for (let key = 0; key<feedBackInfo.length; key++) {
            let arr = [];
            arr.push(feedBackInfo[key].activityName);
            arr.push(feedBackInfo[key].type);
            arr.push(feedBackInfo[key].content);
            arr.push(feedBackInfo[key].name);
            arr.push(feedBackInfo[key].contact);
            arr.push(feedBackInfo[key].time);
            alldata.push(arr)
         }

            const buffer = await xlsx.build([{   
            name: "mySheetName",
            data: alldata
            }]); 
            //将表格存入到存储库中并返回文件ID
            return await cloud.uploadFile({
                cloudPath: 'feedback_box/' + dataCVS,
                fileContent: buffer, //excel二进制文件
            })
    } catch (error) {
        console.error(error)
    }
}
