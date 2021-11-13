import * as echarts from '../ec-canvas/echarts.js'
function getOption() {
  const data = [70, 34, 60, 78, 69]
  const titlename = ['报名人数', '签到人数', '未签到人数', '签退人数', '未签退人数'];
  const myColor = ['#1089E7', '#8B78F6', '#56D0E3', '#F8B448','#F57474' ];
  const option = {      
    grid:{
      left: '30%'
    },
    title: {
      text: "活动详情",
      textStyle: {
        fontSize: 25
      },
      textAlign: 'center',
      left: '50%'
    },
      xAxis: {
          show: false
      },
      yAxis: [{
          show: true,
          data: titlename,
          inverse: true,
          axisLine: {
              show: false
          },
          splitLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLabel: {
              color: '#000',
              fontSize: 14,
              formatter: function(value, index) {
                  return [
                      value
                  ].join('\n')
              },
              // rich: {
              //     lg: {
              //         backgroundColor: '#339911',
              //         color: '#fff',
              //         borderRadius: 15,
              //         align: 'center',
              //         width: 5,
              //         height: 5
              //     },
              // }
          },
      }
  ],
      series: [{
          name: '条',
          type: 'bar',
          yAxisIndex: 0,
          data: data,
          barWidth: 25,
          barGap:'10%',/*多个并排柱子设置柱子之间的间距*/
          // barCategoryGap:'10%',/*多个并排柱子设置柱子之间的间距*/
          itemStyle: {
              normal: {
                  barBorderRadius: 30,
                  color: function(params) {
                      var num = myColor.length;
                      return myColor[params.dataIndex]
                  },
              }
          },
          label: {
              normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}',
                  color: "#000",
                  fontSize: 15
              },

          },
      }
      ]
  };
  return option;
}
export default getOption