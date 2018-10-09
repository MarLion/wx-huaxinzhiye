let head = require('../../utils/api.js');
Page({
  data: {
    auditId:"",
    openId:"",
    token:"",
    currentNode:"",
    remark:"",
    dataList:{},
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      auditId: options.auditId,
      currentNode: options.currentNode,
      openId: userInfo.openId,
      token: userInfo.token
    });
    this.requestDetail();
  },
  requestDetail:function(){
    let that = this;
    let url = head.header + "/mobile/audit/atendChecking";
    wx.request({
      url: url,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        auditId:that.data.auditId,
        token: that.data.token,
        openId:that.data.openId
      },
      success:function(res){
        wx.hideLoading();
        that.setData({
          dataList:res.data,
        });
      }
    })
  },
  inputAdvice:function(e){
    this.setData({
      remark:e.detail.value
    });
  },
  bindAgree:function(){
    wx.showLoading({
      title: '提交中...',
    });
    let that = this;
    let par = {
      openId:that.data.openId,
      token: that.data.token,
      curenNode:that.data.currentNode,
      result:"1",
      auditId:that.data.auditId,
      remark:that.data.remark,
    };
    that.subAdvice(par);
  },
  bindRefuse:function(){
    wx.showLoading({
      title: '提交中...',
    });
    let that = this;
    let par = {
      openId: that.data.openId,
      token: that.data.token,
      curenNode: that.data.currentNode,
      result: "2",
      auditId: that.data.auditId,
      remark: that.data.remark,
    };
    that.subAdvice(par);
  },
  subAdvice:function(param){
    let url = head.header + "/mobile/audit/atendChecked";
    wx.request({
      url: url,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: param,
      success:function(res){
        wx.hideLoading();
        if (res.data.success){
          wx.showToast({
            title: '提交成功',
            icon: "success"
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }else{
          wx.showToast({
            title: '提交失败,请联系管理员!',
            icon: "none"
          });
        }
      }
    })
  }
})