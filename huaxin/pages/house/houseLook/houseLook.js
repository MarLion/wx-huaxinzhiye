const head = require('../../../utils/api.js');
const lookDetailList = "/mobile/house/lookDetailList";
Page({
  data: {
    bindFormSubmit: "",
    houseId:"",
  },
  onLoad: function (options) {
    this.setData({
      houseId: options.houseId
    });
    this.requestData();
  },
  /**
  * 请求数据
  */
  requestData: function () {
    let that = this;
    let url = head.header + lookDetailList;
    let userInfo = wx.getStorageSync("userInfo");
    let para = {
      openId: userInfo.openId,
      houseId: that.data.houseId
    };
    wx.request({
      url: url,
      data: para,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        var lookDetailList = res.data.lookDetailList;
        var community = res.data.community.name
        that.setData({
          lookDetailList: lookDetailList,
          community: community
        })
      }
    })
  },
  

})