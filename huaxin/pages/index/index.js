let head = require('../../utils/api.js');
let reviewUrl = "/mobile/audit/unCheckNumApp";
Page({
  data: {
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    focus: true,
    userAccount:"",
    loginStatue: false,
    haveReviewItem:true,
    haveApplyItem:true,
    userInfo: {},
    openId: "",
    review: [],
    applyNum:"",
    headImg:"",
    token:"",
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      loginStatue: true,
      openId: userInfo.openId,
      token: userInfo.token,
      userInfo: userInfo
    });
  },
  onShow:function(){
    //修改头像后刷新头像
    let headImg = wx.getStorageSync("headImg");
    this.setData({
      headImg: headImg
    });
    this.getReviewMessage(this.data.openId, this.data.token);
  },
  getReviewMessage: function (openid, token){
    let that = this;
    let url = head.header + reviewUrl;
    wx.request({
      url: url,
      data:{
        openId: openid,
        token: token
      },
      success:function(res){
        if(res.data !== ""){
          if (res.data.myCheckMap.length <= 0) {
            that.setData({
              haveReviewItem: false
            });
          } else {
            that.setData({
              haveReviewItem: true
            });
          }
          if (res.data.myApplyMap.length <= 0) {
            that.setData({
              haveApplyItem: false
            });
          } else {
            that.setData({
              haveApplyItem: true
            });
          }
          that.setData({
            review: res.data.myCheckMap,
            applyNum: res.data.myApplyMap
          })
        }     
      }
    })
  },
  navitageToList: function (e) {
    let reviewType = e.currentTarget.dataset.type;
    let url = "../reviewList/reviewList?reviewType=" + reviewType;
    wx.navigateTo({
      url: url,
    })
  },
  navitageToApplyList:function(){
    let url = "../bussApplyList/bussApplyList";
    wx.navigateTo({
      url: url,
    })
  },
  navitageToChart:function(){
    let url = "../opeCharts/opeCharts";
    wx.navigateTo({
      url: url,
    })
  }
})