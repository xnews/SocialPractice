// components/activityHot/hot.js
import * as echarts from '../../ec-canvas/echarts.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    oData: {
      type: Array,
      value: []
    },
    option:{type: Object},
    chartId: {type: String}
  },
  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    option: {}
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    ready() {
      this[this.data.chartId] = this.selectComponent('#' + this.data.chartId)
      this.getData();
    },
    detached(e) {
      this.mychart_pie_hot = null
    },
},
  methods: {        
  getData() {
      this.init_chart();
  },
  init_chart() {
    this[this.data.chartId].init((canvas, width, height,dpr) =>{
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素
      });
      canvas.setChart(chart);
      chart.setOption(this.getOption(),true)
      return chart;
    })
  },
  getOption() {
    const option = this.data.option;
    return option;
    }
  }
})
