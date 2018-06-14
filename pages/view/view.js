
Page({

  /**
   * 页面的初始数据
   */
  data: {
    captchaImage: '../../images/fj.jpeg',
    will_attend : false,
    colseflag:true,
    array: ['lk'],
    dEqpType:[''],
    EqpType: 0,    
    dEqpSn:[''],
    EqpSn:'',
    flag:false,
    hidden: true,
    userID : '',
    animationData: {},
    multiArray: [['洛阳', '开封'], ['洛1', '洛2', '洛3', '洛4', '洛5'], ['猪肉绦虫', '吸血虫']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '洛阳'
        },
        {
          id: 1,
          name: '开封'
        }
      ], [
        {
          id: 0,
          name: '扁性动物'
        },
        {
          id: 1,
          name: '线形动物'
        },
        {
          id: 2,
          name: '环节动物'
        },
        {
          id: 3,
          name: '软体动物'
        },
        {
          id: 3,
          name: '节肢动物'
        }
      ], [
        {
          id: 0,
          name: '猪肉绦虫'
        },
        {
          id: 1,
          name: '吸血虫'
        }
      ]
    ],

    multiIndex: [0, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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
    console.log('show');
    var timestamp = Date.parse(new Date());
    var userTime = wx.getStorageSync('userTime');
    var userInfos = wx.getStorageSync('userData');
    console.log(userTime +"userTime");
    var user = JSON.parse(userInfos);
    console.log(user.Data.userId + "userInfos");
    this.setData({
      userID : user.Data.userId
    })
    console.log(timestamp + "现在");
    if (userInfos && userTime > timestamp) {
      console.log('正常');
    } else {
      wx.reLaunch({
        url: "../login/login"
      })
    }
    this.setData({
      array: getApp().globalData.newArray

    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.closeSocket()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      will_attend: false,
      
    })
    wx.closeSocket()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindPickerChange: function (e) {
    var that = this;
    if (getApp().globalData.newArray == null || getApp().globalData.newArray==''){
      console.log('下拉dddd');
      this.setData({
        flag: false,
        index: e.detail.value,
        will_attend: false,
        EqpSn: that.data.dEqpSn[e.detail.value],
        EqpType: that.data.dEqpType[e.detail.value]
      })
    }else{
      console.log('登陆fff');
      this.setData({
        flag: false,
        index: e.detail.value,
        will_attend: false,
        EqpSn: getApp().globalData.EqpSnArray[e.detail.value],
        EqpType: getApp().globalData.numArray[e.detail.value]
      })
    }
    
    that.close();
  },

  /**
   * 连接服务器
   */
  send: function () {
    var that = this;
    // var msg = '{ "EqpSn": "170801021", "Type": 2}';
    // var msg = '{ "EqpSn": "16110646", "Type": 2}';
    var msg = { "EqpSn": that.data.EqpSn, "Type": 2};
    msg = JSON.stringify(msg);
    console.log('发送' + msg);
    wx.sendSocketMessage({ data: msg })
    
  },
  // 连接开关
  attend_switch:function(e){
    var that = this;
    
    if (e.detail.value==false){
      that.close();
      return;
    }

    console.log(this.data.flag);
    if (this.data.EqpType==3){
      console.log('33333333');
      wx.connectSocket({
        url: 'wss://www.zzhwir.com/wss/S30',
      })
    }else{
      console.log('11111111');
      wx.connectSocket({
        url: 'wss://www.zzhwir.com/wss',
      })
    }
    
    //监听连接状态
    wx.onSocketOpen(function () {
      console.log('WebSocket连接已打开！');
      that.colseflag = true;
      that.send();
      
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：')
      if (that.colseflag==false){
          return;
      }
      that.setData({
        captchaImage: res.data

      })
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    
  },
  close:function(){
    var that = this;
    console.log('关闭WebSocket！')
    that.colseflag = false;
    wx.closeSocket()
    that.setData({
      captchaImage: '../../images/fj.jpeg'
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    console.log("下拉")
    // 获取设备列表
    wx.request({
      url: 'https://www.zzhwir.com/Service/GetEqpListByType',
      data: {
        EqpType: 0,
        UserId: that.data.userID
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log(JSON.stringify(res.data));
        var arr = JSON.stringify(res.data.Data);
        var jsonArray = JSON.parse(arr);
        var arr2 = JSON.stringify(jsonArray.length);

        var sArray = [''];
        var sEqpType = [''];
        var sEqpSn = [''];
        for (var i = 0; i < jsonArray.length; i++) {
          sArray[i] = jsonArray[i].EqpName
          sEqpType[i] = jsonArray[i].EqpType;
          sEqpSn[i] = jsonArray[i].EqpSn;
        }
        that.setData({
          array: sArray,
          dEqpType: sEqpType,
          dEqpSn: sEqpSn

        })
      }
    })
    
    wx.stopPullDownRefresh()
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },
  // onReachBottom: function () {
  //   console.log('sdaaaa');
  //   wx.pageScrollTo({
  //     scrollTop: 800
  //   })
  // }
  ddd:function(){
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiArray[0] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
    
  }
})
