import * as echarts from '../ec-canvas/echarts.js'
function hotChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  const  option = {
    title: {
      text: "活动热度",
      textStyle: {
        fontSize: 25
      },
      textAlign: 'center',
      left: '50%'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 0,
      textStyle:{
        fontSize: 15
      },
      orient: 'vertical'
    },
    grid:{
      bottom: 0
    },
    series: [
      {
        name: '活动热度',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          formatter:'{c}',
          color: '#fff',
          fontSize: '16'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: [
          { value: 1048, name: '浏览量' },
          { value: 735, name: '点赞量' },
          { value: 580, name: '评论量' },
          { value: 484, name: '收藏量' }
        ]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}
export default hotChart