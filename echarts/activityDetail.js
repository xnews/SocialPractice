import * as echarts from '../ec-canvas/echarts.js'
function detailChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  // let category = [];
  // let dottedBase = +new Date();
  // let lineData = [];
  // let barData = [];
  // for (let i = 0; i < 20; i++) {
  // let date = new Date((dottedBase += 3600 * 24 * 1000));
  // category.push(
  //   [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
  // );
  // console.log(category)
  // let b = Math.random() * 200;
  // let d = Math.random() * 200;
  // barData.push(b);
  // lineData.push(d + b);
  // }
  const lineData = [200,180,20,140,40]
  const category = ["报名","签到","未签到","签退","未签退"]
  const option = {
    title: {
      text: '活动详情',
      textStyle: {
        fontSize: 25
      },
      textAlign: 'center',
      left: '50%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend:{
      show: true,
      top: '10%',
      textStyle:{
        fontSize: 15
      }
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: '#464646'
        }
      }
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#464646'
        }
      }
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        barGap: '-100%',
        barWidth: 35,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        z: -12,
        data: lineData
      },
      {
        name: '人数',
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 10,
        data: lineData
      },
      {
        name: '人数',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: '#fff'
        },
        symbolRepeat: true,
        symbolSize: [20,1],
        symbolMargin: 4,
        z: -10,
        data: lineData
      }
    ]
  };
  chart.setOption(option);
  return chart;
}
export default detailChart