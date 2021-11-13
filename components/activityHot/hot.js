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
    option:{type: Object}
  },
  /**
   * 组件的初始数据
   */
  data: {
    activityHot: {
      lazyLoad: true
    },
    option: {}
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    ready() {
      this.mychart_pie_hot = this.selectComponent('#mychart_pie_hot')
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
    this.mychart_pie_hot.init((canvas, width, height,dpr) =>{
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素
      });
      canvas.setChart(chart);
      chart.setOption(this.getOption())
      return chart;
    })
  },
  getOption() {
    const option = this.data.option;
    return option;
    }
  }
})
