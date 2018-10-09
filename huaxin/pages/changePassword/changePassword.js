let head = require('../../utils/api.js');
Page({
  data: {
    oldPassword:"",
    newPassword:"",
    confirmPassword:"",
    openId:"",
    token:"",
  },
  onLoad:function(){
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      openId: userInfo.openId,
      token: userInfo.token
    });
  },
  oldPassword:function(e){
    this.setData({
      oldPassword:e.detail.value
    });
  },
  newPassword:function(e){
    this.setData({
      newPassword: e.detail.value
    });
  },
  confirmPassword:function(e){
    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindAgree:function(){
    let that = this;
    let pat = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if (that.data.oldPassword == ""){
      wx.showToast({
        title: '请填写旧密码',
        icon:"none"
      });
    } else if (that.data.newPassword == ""){
      wx.showToast({
        title: '请填写新密码',
        icon: "none"
      });
    } else if (!pat.test(that.data.newPassword)){
      wx.showToast({
        title: '密码必须由字母和数字组成，最少6位',
        icon: "none"
      });
    } else if (that.data.confirmPassword == ""){
      wx.showToast({
        title: '请再次输入新密码',
        icon: "none"
      });
    } else if (that.data.oldPassword == that.data.newPassword){
      wx.showToast({
        title: '新旧密码不能相同',
        icon: "none"
      });
    } else if (that.data.newPassword != that.data.confirmPassword){
      wx.showToast({
        title: '两次输入的新密码不一致',
        icon: "none"
      });
    }else{
      wx.showLoading({
        title: '提交中...',
      });
      wx.request({
        url: head.header + '/mobile/manage/changePassword',
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          oldPsw:that.data.oldPassword,
          newPsw:that.data.newPassword,
          openId:that.data.openId,
          token: that.data.token,
        },
        success:function(res){
          wx.hideLoading();
          if(res.data.success){
            wx.showToast({
              title: res.data.message,
            });
            setTimeout(function(){
              wx.navigateBack({});
            },1500)
          }else{
            wx.showToast({
              title: res.data.message,
            });
          }
        }
      })
    }
  },
  bindRefuse:function(){
    wx.navigateBack({});
  }
})