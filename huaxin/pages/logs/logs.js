let head = require('../../utils/api.js');
Page({
  data: {
    loginStatue: false,
    focus:true,
    userAccount:"",
    passWord:"",
  },
  onLoad: function () {
    let userInfo = wx.getStorageSync("userInfo") || {};
    if (!userInfo.openId) {
      this.setData({
        loginStatue: false
      });
    } else {
      this.setData({
        loginStatue: true,
      });
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  bindAccount: function () {
    wx.showLoading({
      title: '登录中...',
    });
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: head.header + '/js/weixinopenid',
            data: {
              js_code: res.code,
              userName: that.data.userAccount,
              password: that.data.passWord
            },
            success: function (data) {  
              wx.hideLoading();
              if (data.data.success) {
                wx.setStorageSync('userInfo', data.data.result);
                wx.setStorageSync('headImg', data.data.result.empImg);
                that.setData({
                  loginStatue: true
                });
                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                wx.showModal({
                  title: "提示",
                  content: data.data.message,
                  showCancel: false
                })
              }
            }
          })
        }
      }
    })
  },
  inputAccount: function (e) {
    this.setData({
      userAccount: e.detail.value
    })
  },
  inputPassWord:function(e){
    this.setData({
      passWord: e.detail.value
    })
  }
})