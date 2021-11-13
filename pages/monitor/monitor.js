// pages/monitor/monitor.js
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    poi:{
      latitude: null,
      longitude: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const key = 'G7DBZ-OYC62-OKKUB-CVCND-YTXFV-QXBU2'; //使用在腾讯位置服务申请的key
    const referer = '腾讯位置服务地图选点'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: 26.663121,
      longitude: 119.568287512
    });
    const category = '';
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location,'位置')
    const poi = {
      latitude: location.latitude,
      longitude: location.longitude
    }
    const markers = []
    markers.push ({
      id: 1,
      latitude: location.latitude,
      longitude: location.longitude,
      iconPath: '../../images/hdqd/destination.png', // 图标路径
      width: 50,
      height: 50,
    })
    this.setData({
      poi,
      markers
    })
    console.log(poi,'poi')
  },
  onUnload: function () {
    chooseLocation.setLocation(null);
  }
})