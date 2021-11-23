// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "cloud-8gy1484h4171152a"
})

import xlsx from 'node-xlsx';    //导入Excel类库
const db = cloud.database()   //声明数据库对象
const _ = db.command
exports.main = async (event, context) => {   //主函数入口
    try {
        let practiceInfo = event.tabledata;
        console.log(practiceInfo);
        let dataCVS = `practiceInfo-${Math.floor(Math.random()*1000000000)}.xlsx`
        //声明一个Excel表，表的名字用随机数产生
        let alldata = [];
        let row = ['学号', '姓名','专业','实践时长','排名']; //表格的属性，也就是表头说明对象
        alldata.push(row);  //将此行数据添加到一个向表格中存数据的数组中
//接下来是通过循环将数据存到向表格中存数据的数组中
        for (let key = 0; key<practiceInfo.length; key++) {
            let arr = [];
            arr.push(practiceInfo[key].stuNum);
            arr.push(practiceInfo[key].name);
            arr.push(practiceInfo[key].professial);
            arr.push(practiceInfo[key].practiceTime);
            arr.push(practiceInfo[key].rank);
            alldata.push(arr)
         }
            var buffer = xlsx.build([{   
            name: "mySheetName",
            data: alldata
            }]); 
            //将表格存入到存储库中并返回文件ID
            return await cloud.uploadFile({
                cloudPath: dataCVS,
                fileContent: buffer, //excel二进制文件
            })
    } catch (error) {
        console.error(error)
    }
}
