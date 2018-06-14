var wxRequest = require('../../utils/wxRequest.js')
// pages/others/pictures/pictures.js
Page({
  data: {
    userID: '',
    isfirstGetL:true,
    issecondGetL: false,
    isthreeGetL: false,
    colseflag: true,
    EqpSn:'',
    activePic: '/images/example0.png',
    activeIndex: 0,
    imgs: [
      {
        url: '/images/example0.png'
      },
      {
        url: '/images/example1.png'
      },
      {
        url: '/images/example2.png'
      },
      {
        url: '/images/example3.png'
      }
    ],
    multiArray: [],
    multiIndex: [0, 0, 0],
    //跑马灯
    text: '',
    mData:'',
    array: [''],
    arrayCopy: [''],
    dEqpType: [''],
    EqpType: 0,
    dEqpSn: [''],
    EqpSn: '',
    length:0,
    activeIndex5: 1,
    arrDeptID:[],
    click_pik: 0,  //记录上次点击选择的一级区域
    isClose:false,  //检测是否Socket关闭成功
    isgetSecond :false,

    //搜索相关
    inputShowed: false,
    inputHiden :true,
    inputVal: "",
    idx:'',
    itemName:'',
    index:''
   
  },
  onLoad:function(){
     console.log('onload');
     var that = this;
     //登录信息缓存判断  Begin
     var timestamp = Date.parse(new Date());
     var userTime = wx.getStorageSync('userTime');
     var userInfos = wx.getStorageSync('userData');
     console.log(userTime + "userTime");
     var user = JSON.parse(userInfos);
     console.log(user.Data.userId + "userInfos");
     this.setData({
       userID: user.Data.userId
     })
     console.log(timestamp + "现在");
     if (userInfos && userTime > timestamp) {
       console.log('正常');
     } else {
       wx.reLaunch({
         url: "../login/login"
       })
     }
   //登录信息缓存判断  END

     //初次加载区域列表
     var url = 'https://www.zzhwir.com/Service/GetMenu';
    //  var url = '';
     console.log('用户IDIDID'+that.data.userID)
     var params = {
       userId: that.data.userID
     }
     var info = wxRequest.getRequest(url, params).
       then(res => {
         that.setData({
           mData: res.data.Data
       });
         
       }).then(res => {
         var depts = that.data.mData;
         console.log('区域列表'+depts);
         depts = JSON.parse(depts);
         depts = depts.depts;
         depts = depts[0].depts;
         var infoa = JSON.stringify(depts);
         var deptId = that.getV(depts);
         var deptIdLehgth = [];
         console.log('区域数组'+deptId);
         var max = Math.max.apply(null, deptId).toString().length-1;
         var min = Math.min.apply(null, deptId).toString().length-1;
         console.log('max' + max);
          console.log('min'+min);
          if (max/min==1){
            that.setData({
              multiArray: [[],[]]
            })
          } else if (max / min == 2){
            that.setData({
              multiArray: [[],[],[]]
            })
          }else {
            that.setData({
              multiArray: [[], [],[],[]]
            })
          }
         console.log('infoinfo' + infoa)
         var data = {
           multiArray: this.data.multiArray,
           multiIndex: this.data.multiIndex
         };
         data.multiArray[0] = []; //设值之前先清空
         for (var i = 0; i < depts.length; i++) {   //此循环用于设置区域一维数组的值，即洛阳，开封等市值
           console.log(depts[i].DeptName);
           data.multiArray[0].push(depts[i].DeptName)
         }
         if (depts[0].hasOwnProperty("depts")){     //如果一级市区下还有区域
          console.log('市下还有区域，。。。');
           var config = depts[0].depts;             //首次加载给第二列表区域设置值
           for (var i = 0; i < config.length; i++) {
             data.multiArray[1].push(config[i].DeptName)
           }
         }
        
         this.setData(data);
       });
  },
  onReady:function(){
    console.log('onReady');
  },
  onShow: function () {
    var that = this;
    console.log('onshow');

    this.setData({
      // length: this.data.imgs.length,
      imgs5: this.data.imgs,
      activePic5: this.data.activePic,
      // activeIndex5: this.data.activeIndex,

    });
    
  },
  onHide:function(){
    console.log('页面隐藏');
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('页面卸载');
    this.setData({
      will_attend: false,

    })
    wx.closeSocket()
  },
  pre5: function () {
    // 上一页
    var vm = this;
    if (vm.data.activeIndex5 > 1) {
      // vm.animateOut5();
      // setTimeout(function () {
        
      //   vm.setData({
      //     activePic: vm.data.imgs5[vm.rd(0, vm.data.imgs.length- 1)].url,
      //     activeIndex5: vm.data.activeIndex5 - 1
      //   });
        
      //   vm.animateIn5();
      // }, 100);
      vm.setData({
        activePic: vm.data.imgs5[vm.rd(0, vm.data.imgs.length - 1)].url,
        activeIndex5: vm.data.activeIndex5 - 1
      });
      vm.close();
      
      
      var page = vm.data.activeIndex5 - 1;  //要显示的设备下标
      vm.setData({
        EqpSn: vm.data.dEqpSn[page-1],
        text: vm.data.array[page-1]
      })
      wx.showLoading({
        title: '努力加载中'
      })
      // console.log('上一页activeIndex5--' + page);
      vm.linkSocket(page-1);       //点击上一页，连接Socket
      
    } else {
      wx.showToast({
        title: '前面没有了',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  next5: function () {
    // 下一页
    var vm = this;
    if (vm.data.activeIndex5 < vm.data.length) {
      // vm.animateOut5();
      // setTimeout(function () {
      
      //   var m = vm.data.imgs.length;
      //   vm.setData({
      //     activePic: vm.data.imgs5[vm.rd(0, m-1)].url,
      //     activeIndex5: vm.data.activeIndex5 + 1
      //   });
      //   vm.animateIn5();
      // }, 100);
      var m = vm.data.imgs.length;
      vm.setData({
          activePic: vm.data.imgs5[vm.rd(0, m-1)].url,
          activeIndex5: vm.data.activeIndex5 + 1
        });
      vm.close();
      var page = vm.data.activeIndex5 + 1;
      vm.setData({
        EqpSn: vm.data.dEqpSn[page-1],
        text: vm.data.array[page-1]
      })
      wx.showLoading({
        title:'数据加载中'
      })
      // console.log('下一页activeIndex5--' + page);
      vm.linkSocket(page-1);       //点击下一页，连接Sockets
      
    }else{
      wx.showToast({
        title: '最后一个了',
        icon: 'none',
        duration: 2000
      })
    }
    
        
  },
  animateIn5: function () {
    // 图片显示动画
    var animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(2, 0.8).step()
    this.setData({
      animationData5: animation.export()
    })
    setTimeout(function () {
      animation.scale(0.8, 1).step()
      this.setData({
        animationData5: animation.export()
      })
    }.bind(this), 100)

    setTimeout(function () {
      animation.scale(1, 0.8).step()
      this.setData({
        animationData5: animation.export()
      })
    }.bind(this), 350)

    setTimeout(function () {
      animation.scale(1, 1).step()
      this.setData({
        animationData5: animation.export()
      })
    }.bind(this), 350)
  },
  animateOut5: function () {
    // 图片隐藏动画
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.scale(0, 0).step()
    this.setData({
      animationData5: animation.export()
    });
  },



  click_picker:function(){
    var that = this;
    var cv = that.data.mData;
    var info = JSON.parse(cv);
    var depts = info.depts;         //这是市级列表
    depts = depts[0].depts;  
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    var num = data.multiArray.length - 1;  //点击地区按钮先把设备列表清除
    data.multiArray[num] = [];

    if (data.multiArray[0].length>0){
      var pickNum = that.data.click_pik;
      console.log('pickNum'+pickNum)
      var code = depts[pickNum].DeptID
       console.log('code' + code);
       that.getList(code);
    }
  
  },
  bindMultiPickerChange: function (e) {
    var that = this;
    that.close();
    console.log('picker发送选择改变，携带值为', e.detail.value)  // [0, 1, 1, 3]
    var num = e.detail.value;
    var data = {
      multiEqpSn: this.data.dEqpSn,
    };
    this.setData({    //记录一级区域的数组下标
      click_pik: num[0]
    })
    console.log('num长度' + num[num.length - 1])
    console.log(that.data.dEqpSn[num[num.length - 1]])
    console.log(that.data.dEqpType[num[num.length - 1]])
    console.log('名字啊' + that.data.array[num[num.length-1]])

    if (that.data.dEqpSn[num[num.length - 1]] === '' || num[num.length - 1]==null){
      console.log('信息不完整，不连接')
      return;
    }
    that.setData({
      EqpSn: that.data.dEqpSn[num[num.length - 1]],
      text: that.data.array[num[num.length - 1]]
    })
    wx.showLoading({
      title: '努力加载中'
    })
    that.linkSocket(num[num.length - 1]);
    

  },
  
  bindMultiPickerColumnChange: function (e) {             //列表滚动事件
    var that = this;
    // that.close();    
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    var cv = that.data.mData;
    var info = JSON.parse(cv);
    console.log('地区'+info.depts); //区域列表

    var depts = info.depts;         //这是市级列表
    // var infoad = JSON.stringify(depts);
    // console.log('infoadinfoadinfoad' + infoad); 
    depts = depts[0].depts;           //把河南(省份)去除
    var infoad = JSON.stringify(depts);
    console.log('infoadinfoadinfoad' + infoad); 
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    
    var dName = data.multiArray[e.detail.column][e.detail.value];     //用户滑动列表选择的地区名
    
    data.multiIndex[e.detail.column] = e.detail.value;

    

    var d1 = data.multiArray[0];  //第一列市区名字
    if (e.detail.column==0){
      console.log('第一区域滚动变化' + e.detail.value)
      console.log('长度' + data.multiArray.length)
      var multiArrayL = data.multiArray.length;
      if (multiArrayL == 1){                        //1只有一级区域，无设备
      } else if (multiArrayL == 2) {                //2只有一级区域，有设备
        data.multiArray[1] = [];
      } else if (multiArrayL == 3) {                //3只有二级区域，有设备
        data.multiArray[1] = [];
        data.multiArray[2] = [];
      }else {
        data.multiArray[1] = [];
        data.multiArray[2] = [];
        data.multiArray[3] = [];
      }
      
      this.setData({    //记录一级区域的数组下标
        click_pik: e.detail.value
      })
      for (var i = 0; i < d1.length;i++){
        if (depts[i].hasOwnProperty("depts")){
           console.log('一级区域滚动,还有二级区域，很皮')
           that.setData({
             isfirstGetL:false,
             issecondGetL: true
           });
           if (dName === d1[i]) {
             var d2 = depts[i].depts;
             data.multiIndex[0] = i;   //赋值 得到第一列区域的选中数组下标
             data.multiArray[1] = [];  //当切换第一区域时，清除第二级联动  

             var code = d2[0].DeptID
             console.log('滑动一级区域填充二级后code' + code);

             that.getList(code);
             that.setData({
               isgetSecond: true
             });
             for (var j = 0; j < d2.length; j++) {
               data.multiArray[1].push(d2[j].DeptName)
             }
             if (d2[0].hasOwnProperty("depts")){
               console.log('二级区域下还有三级区域，你更皮')
               
               
               data.multiArray[2] = [];
               for (var k = 0; k < (d2[0].depts).length; k++) {
                 data.multiArray[2].push((d2[0].depts)[k].DeptName)
               }
              }
             
           }
        }
        
      }
      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;
      // if (that.data.isfirstGetL){
      console.log(that.data.isgetSecond)
      if (!that.data.isgetSecond){                      //证明有二级区域，需要在二级区域下获取列表，一下不需要
        console.log('滑动一级区域获取列表开始');
        
        var code = depts[e.detail.value].DeptID
        console.log('code' + code);
        that.getList(code);
        }
        that.setData({
          isgetSecond: false
        });
      // }
    } else if (e.detail.column == 1){
      console.log('第二区域滚动变化' + e.detail.value)
      data.multiIndex[1] = e.detail.value;//赋值 得到第二列区域的选中数组下标
      var shi = depts[data.multiIndex[0]].depts;
      console.log('shishishi'+shi);
      if (shi[e.detail.value].hasOwnProperty("depts")){   //如果二级下还有三级
        var shi3 = shi[e.detail.value].depts;     //得到的选中第三级的区域列表
        console.log('shishishi333' + shi3);
        data.multiArray[2] = [];
        for (var i = 0; i < shi3.length; i++) {
          data.multiArray[2].push(shi3[i].DeptName);
        }
      }
      

      // if (that.data.issecondGetL) {
        console.log('滑动二级区域获取列表开始');
        var tt = depts[data.multiIndex[0]].depts;
        var name = tt[e.detail.value].DeptID;
        that.getList(tt[e.detail.value].DeptID);
      // }

    } 
    // else if (e.detail.column == 2) {
    //   console.log('第三区域滚动变化' + e.detail.value)
    //   that.data.isthreeGetL = true;
    //   data.multiIndex[2] = e.detail.value;
    //   if (that.data.isthreeGetL) {
    //     console.log('滑动三级区域获取列表开始');
    //     var tt = depts[data.multiIndex[0]].depts;
    //     var dd = tt[data.multiIndex[1]].depts;
    //     var name = dd[e.detail.value].DeptName;
    //     console.log(name);
    //     console.log('code' + dd[e.detail.value].DeptID);
    //     that.getList(dd[e.detail.value].DeptID);
    //   }
    // }
    this.setData(data);
    console.log('aaaaaaaa'+data.multiIndex[2])
  },

  /**
    * 连接服务器
    */
  send: function () {
    var that = this;
    // var msg = '{ "EqpSn": "170801021", "Type": 2}';
    // var msg = '{ "EqpSn": "16110646", "Type": 2}';
    var msg = { "EqpSn": that.data.EqpSn, "Type": 2 };
    msg = JSON.stringify(msg);
    console.log('发送' + msg);
    wx.sendSocketMessage({ data: msg })

  },

  // 搜索相关
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that = this;
    this.setData({
      inputHiden: true,
      inputVal: e.detail.value
    });
    console.log(e.detail.value)
    console.log('设备列表'+that.data.array);
    var arr = that.data.array;
    var arrInput = [];

    for (var i = 0; i < arr.length;i++){                    //全部设备列表
      if (arr[i].match(e.detail.value + ".*") != null) {
        console.log('包含')
        console.log(arr[i]);
        
        arrInput.push(arr[i])
      }
    }
    this.setData({
      arrayCopy: arrInput
      
    });

  },




















  //获取json对象长度
  getJsonLength:function(jsonData) {
    var length;  
    for(var ever in jsonData) {
          length++;
        }
        return length;
},
//获取设备列表
getList:function(code){
  var that = this;
  var data = {
    multiArray: this.data.multiArray,
    multiIndex: this.data.multiIndex
  };
  wx.request({
    url: 'https://www.zzhwir.com/Service/GetEqpListByType',
    data: { "EqpType": 0, "UserId": that.data.userID, "DeptCode": code },
    // data: { "EqpType": 0, "UserId": 2, "DeptCode": "000001002" },
    header: {
      'content-type': 'application/json'
    },
    method: "POST",
    success: function (res) {
      var lNum = 0;  //设备数
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
      var nL = data.multiArray.length;                //区域数组长度
      console.log('数组页ssssss'+data.multiArray.length)
      console.log('列表sssssssss' + sArray);
      var num = data.multiArray.length-1;
      data.multiArray[num] = [];
      for (var i = 0; i < sArray.length;i++){
        lNum ++;
        data.multiArray[num].push(sArray[i]);
      }
      that.setData(data);      
      console.log('列表'+sArray);
      console.log('列表' + lNum);
      that.setData({
        array: sArray,
        arrayCopy: sArray,
        dEqpType: sEqpType,
        dEqpSn: sEqpSn,
        length: lNum

      })
    }
  })
},
 rd:function (n, m) {  //获取n-m随机整数
  var c = m - n + 1;
  return Math.floor(Math.random() * c + n);
},
getV:function(depts){
  var that = this;
  try{
    var len = depts.length;
  }catch(err){
    console.log('回归长度异常了');
    return ;
  }
  for (var i = 0; i < len; i++) {
    var object = depts[i];
    var infoa = JSON.stringify(object);
    that.getV(object.depts);
    that.data.arrDeptID.push(object.DeptID)
  }
  
  return that.data.arrDeptID
},
//连接socket
linkSocket:function(nums){
  var that = this;
  //开始连接socket
  console.log('nnnnnnnnnnnnnnn'+nums)
  if (that.data.dEqpType[nums] == 3) {
    console.log('33333333');
    wx.connectSocket({
      url: 'wss://www.zzhwir.com/wss/S30',
    })
  } else {
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
      if (that.colseflag == false) {
        console.log('不加载图像');
        return;
      }
    that.setData({
      activePic: res.data

    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  })
  wx.onSocketError(function (res) {
    console.log('WebSocket连接打开失败，请检查！')
  })
  wx.onSocketClose(function (res) {
    that.setData({
      isClose: true
    })
    console.log('WebSocket 已关闭！')
  })
},
close: function () {
  // setTimeout(function () {
  //   wx.hideLoading()
  // }, 2000)
  var that = this;
  console.log('关闭WebSocket！')
  that.colseflag = false;
  
  wx.closeSocket({
    success: function (res) {
      console.log('关闭成功')
    },
    fail: function (res) {
      console.log('关闭失败')
    }
  }
  )
  that.setData({
    activePic: that.data.imgs5[that.rd(0, that.data.imgs.length - 1)].url
  })
},
  closeAll:function(){
      var that = this;
      setTimeout(function () {
      wx.hideLoading()
      }, 2000)
  that.close();
  },

  // 搜索 Begin
  click_navigator :function(e){
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(index)
    var arr = that.data.array;
    console.log(arr[index])
    that.setData({
      inputVal:arr[index],
      inputHiden: false

    })
    that.close();
    that.setData({
      EqpSn: that.data.dEqpSn[index],
      text: that.data.array[index]
    })
    wx.showLoading({
      title: '数据加载中'
    })
    that.linkSocket(index);       //点击下一页，连接Sockets
  }


})