let head = require('../../utils/api.js');
let detailUrl = "/mobile/audit/atendChecking";
Page({
  data: {
    auditId:"",
    dataList:[],
  },
  onLoad: function (options) {
    this.setData({
      auditId: options.auditId
    });
    this.requestData();
  },
  requestData:function(){
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let url = head.header + detailUrl;
    wx.request({
      url: url,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        openId:userInfo.openId,
        token: userInfo.token,
        auditId: that.data.auditId
      },
      success:function(res){
        that.setData({
          dataList:res.data
        });
      }
    })
  }
})