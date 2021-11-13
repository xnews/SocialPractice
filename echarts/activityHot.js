import * as echarts from '../ec-canvas/echarts.js'
function getOption(data) {
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
        data:  data,
        animation: true,
        animationDuration: 3000,
      }
    ]
  };
  return option
}

export default getOption