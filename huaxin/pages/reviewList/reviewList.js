let head = require('../../utils/api.js');
let listUrl = "/mobile/audit/unCheckListApp";
Page({
  data: {
    reviewType:"",
    reviewingList:[],
    noMore:false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    });
    this.setData({
      reviewType: options.reviewType
    });
  },
  onShow:function(){
    let userInfo = wx.getStorageSync("userInfo");
    this.getList(userInfo.openId, userInfo.token);
  },
  getList:function(openid,token){
    let that = this;
    let url = head.header + listUrl;
    wx.request({
      url: url,
      data: {
        openId: openid,
        type:that.data.reviewType,
        token: token
      },
      success:function(res){
        wx.hideLoading();
        if (res.data.data.length == 0){
          that.setData({
            noMore: true
          });
        }
        that.setData({
          reviewingList: res.data.data
        });
      }
    })
  },
  navigateToDetail:function(e){
    let that = this;
    let houseid = e.currentTarget.dataset.houseid;
    let Type = that.data.reviewType;
    let detailUrl = "";
    if (Type == "HOUSE_ADD") {
      detailUrl = "../reviewDetail/reviewDetail?type=" + Type + "&houseid=" + e.currentTarget.dataset.houseid + "&checkid=" + e.currentTarget.dataset.checkid;
    } else if (Type == "HOUSE_UPDATE"){
      detailUrl = "../reviewDetail/reviewDetail?type=" + Type + "&houseid=" + e.currentTarget.dataset.houseid + "&checkid=" + e.currentTarget.dataset.checkid;
    } else if (Type == "KEY"){
      detailUrl = "../reviewDetail/reviewDetail?type=" + Type + "&houseCheckId=" + e.currentTarget.dataset.checkid;
    } else if (Type == "PHOTO"){
      detailUrl = "../reviewDetail/reviewDetail?type=" + Type + "&houseid=" + e.currentTarget.dataset.houseid + "&checkid=" + e.currentTarget.dataset.checkid;
    } else if(Type == "EXCLUSIVE"){
      detailUrl = "";
    } else if (Type == "JF_LOOK_ADD"){
      detailUrl = "../reviewDetail/reviewDetail?type=" + Type + "&customerCheckId=" + e.currentTarget.dataset.customerCheckid;
    } else if (Type == "JF_NEWLOOK_ADD") {
      detailUrl = "../reviewDetail/reviewDetail?type=" + Type + "&customerCheckId=" + e.currentTarget.dataset.customerCheckid;
    } else {
      detailUrl = "../reviewSignDetail/reviewSignDetail?type=" + Type + "&orderId=" + e.currentTarget.dataset.orderId + "&orderAudit=" + e.currentTarget.dataset.orderAudit + "&orderCheckId=" + e.currentTarget.dataset.orderCheckid;
    }
    wx.navigateTo({
      url: detailUrl
    })
  }
})