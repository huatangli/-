// var calcMD5 = require('../../js/md5.js');
// var Util = require('../util/util.js');
Page({
  data: {
    userName: '',
    pwd: '',
  },
  /**
   * 初始化加载
   * options url 参数
   */
  onLoad: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    var userTime = wx.getStorageSync('userTime');
    var userInfos = wx.getStorageSync('userData');
    console.log('userInfos' + userInfos);
    if (userInfos && userTime > timestamp){
      
      var info = JSON.parse(userInfos);
      console.log('info.userName' + info.Data.userName);
      that.setData({
        userName: info.Data.userName,
        pwd: info.password
      })
    }else{
      
    }

    
  },
  userInputEvent: function (e) {
    this.setData({
      userName: e.detail.value,
    })
  },
  pwdInputEvent: function (e) {
    this.setData({
      pwd: e.detail.value,
    })
  },
  /**
   * 登录
   */
  login: function(e){
    
    var that = this;
    console.log("用户输入"+that.data.userName + that.data.pwd);
    wx.request({
      // url: 'https://19774l8z12.applinzi.com/wx.php',
      url: 'https://www.zzhwir.com/Service/Login',
      data: {
        userName: that.data.userName,
        password: that.data.pwd
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        // console.log(res.data.Data.userId);
        // console.log(JSON.stringify(res.data));
        
        if (res.data.Result==1){
          // 保存用户信息到缓存中
          var str = { "Msg": "成功", "Result": 1, "Data": { "userId": res.data.Data.userId, "userName": that.data.userName }, "password": that.data.pwd };
          var userInfos = JSON.stringify(str);
          var timestamp = Date.parse(new Date());
          // var userTime = timestamp + 864000000;  1000 ==>1s
          var userTime = timestamp + 864000000;
          wx.setStorageSync('userData', userInfos);
          wx.setStorageSync('userTime', userTime);
          that.getList(res.data.Data.userId);
          // wx.showToast({
          //   title: '成功',
          //   icon: 'loading',
          //   duration: 50000,
          //   success: function () {
          //     wx.reLaunch({
          //       url: "../view/view"
          //     })
              
          //   }
          // })

          

        } else if (res.data.Result == 0){
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '未知错误',
            icon: 'none',
            duration: 2000
          })
        }
        
      }
    })

  },
  getList:function(userId){        //获取设备列表
  console.log('求你进来吧');
    // 获取设备列表
    wx.request({
      url: 'https://www.zzhwir.com/Service/GetEqpListByType',
      data: {
        EqpType: 0,
        UserId: userId
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

        for (var i = 0; i < jsonArray.length; i++) {
          // var na = getApp().globalData.newArray;
          getApp().globalData.newArray[i] = jsonArray[i].EqpName;
          getApp().globalData.numArray[i] = jsonArray[i].EqpType;
          getApp().globalData.EqpSnArray[i] = jsonArray[i].EqpSn;

        }
        console.log('登陆页设备列表' + getApp().globalData.newArray);
        wx.showToast({
          title: '成功',
          icon: 'loading',
          duration: 50000,
          success: function () {
            wx.reLaunch({
              url: "../pictures/pictures"
            })

          }
        })

      }
    })
  }
})
