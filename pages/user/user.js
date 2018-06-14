var app = getApp()
Page({
  data: {
    shopId: '',
    busname: ''
  },
  onLoad:function(){
  },
  onShow: function () {
    var timestamp = Date.parse(new Date());
    var userTime = wx.getStorageSync('userTime');
    var userInfos = wx.getStorageSync('userData');
    if (userInfos && userTime > timestamp) {
      console.log('正常');
    } else {
      wx.reLaunch({
        url: "../login/login"
      })
    }
    
  },
  //
  toLogin: function () {
    app.ZZtoLogin()
  },
  // 客服电话
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '0371-85511233'
    })
  },
  // 清楚缓存
  clear:function(){
    wx.showToast({
      title: '已清除',
      icon: 'success',
      duration: 2000
    })
  },
  li_button:function(){
    wx.closeSocket()
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket 已关闭！')
    // })
    getApp().globalData.newArray = ['']; //把全局变量置为空
    getApp().globalData.EqpSnArray = [''];
    getApp().globalData.numArray = [''];
    wx.showToast({
      title: '',
      icon: 'loading',
      duration: 20000
    })
  },
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '郑州海威光电科技有限公司是一家从事高科技红外热像仪以及相关光学、系统产品的研发、生产和销售的高新技术企业,截止目前，海威光电拥有10项专利以及4项软件著作权，1件软件产品登记.于2016年顺利通过ISO9001质量管理体系认证并被评为3A级信用企业.管理人员和开发人员均有5年以上从事红外热像领域工作经验',
      showCancel: false
    })
  }
  
})