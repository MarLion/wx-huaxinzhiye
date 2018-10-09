let head = require('../../utils/api.js');
let listUrl = "/mobile/audit/myAuditingApply";
Page({
  data: {
    openId:"",
    token:"",
    page:1,
    applyList:[],
    noMore:false,
    scrollTop:0
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    let userInfo = wx.getStorageSync("userInfo"); 
    this.setData({
      openId:userInfo.openId,
      token: userInfo.token
    });
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        })
      },
    });
  },
  onShow:function(){
    this.setData({
      applyList: []
    });
    this.getApplyList();
  },
  getApplyList:function(){
    let that = this;
    let url = head.header + listUrl;
    wx.request({
      url: url,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        openId:that.data.openId,
        token: that.data.token,
        pageNo:that.data.page
      },
      success:function(res){
        wx.hideLoading();
        let list = that.data.applyList;
        for (let i = 0; i < res.data.list.length; i++){
          list.push(res.data.list[i]);
        }
        that.setData({
          applyList: list
        });
        if (list.length == res.data.totalSize){
          that.setData({
            noMore:true
          })
        }
      }
    })
  },
  bindDownLoad:function(){
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    that.setData({
      page:that.data.page+1
    });
    that.getApplyList();
  },
  topLoad:function(){
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    that.setData({
      page:1,
      applyList:[]
    });
    that.getApplyList();
  },
  scroll: function (event){
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  navigateToDetail:function(e){
    let that = this;
    let detailUrl = "";
    let Type = e.currentTarget.dataset.type;
    if (Type.indexOf("HOUSE_ADD") != -1) {
      detailUrl = "../bussApplyDetail/bussApplyDetail?type=" + Type + "&houseid=" + e.currentTarget.dataset.houseid + "&checkid=" + e.currentTarget.dataset.checkid;
    } else if (Type.indexOf("HOUSE_UPDATE") != -1) {
      detailUrl = "../bussApplyDetail/bussApplyDetail?type=" + Type + "&houseid=" + e.currentTarget.dataset.houseid + "&checkid=" + e.currentTarget.dataset.checkid;
    } else if (Type.indexOf("KEY") != -1) {
      detailUrl = "../bussApplyDetail/bussApplyDetail?type=" + Type + "&houseCheckId=" + e.currentTarget.dataset.checkid;
    } else if (Type.indexOf("PHOTO") != -1) {
      detailUrl = "../bussApplyDetail/bussApplyDetail?type=" + Type + "&houseid=" + e.currentTarget.dataset.houseid + "&checkid=" + e.currentTarget.dataset.checkid;
    } else if (Type.indexOf("EXCLUSIVE") != -1) {
      detailUrl = "";
    } else if (Type.indexOf("JF_LOOK_ADD") != -1) {
      detailUrl = "../bussApplyDetail/bussApplyDetail?type=" + Type + "&customerCheckId=" + e.currentTarget.dataset.customerCheckid;
    } else if (Type.indexOf("JF_NEWLOOK_ADD") != -1) {
      detailUrl = "../bussApplyDetail/bussApplyDetail?type=" + Type + "&customerCheckId=" + e.currentTarget.dataset.customerCheckid;
    } else if(Type.indexOf("ORDER") != -1) {
      detailUrl = "../bussApplySignDetail/bussApplySignDetail?type=" + Type + "&orderId=" + e.currentTarget.dataset.orderId + "&orderAudit=" + e.currentTarget.dataset.orderAudit + "&orderCheckId=" + e.currentTarget.dataset.orderCheckid;
    }
    wx.navigateTo({
      url: detailUrl,
    })
  }
})