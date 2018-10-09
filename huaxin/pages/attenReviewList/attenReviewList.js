let head = require('../../utils/api.js');
let calc = require('../../utils/util.js');
let listUrl = "/mobile/audit/myAtendCheckApp";
Page({
  data: {
    openId:"",
    token:"",
    currentTab:0,  
    winHeight:"",
    paramType:"1",
    dataListOne:[],
    dataListTwo: [],
    dataListThree: [],
    oneNoe:false,
    twoNoe: false,
    threeNoe: false,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      openId:userInfo.openId,
      token: userInfo.token,
      winHeight: calc.calc
    });
  },
  onShow:function(){
    this.setData({
      dataListOne: [],
      dataListTwo: [],
      dataListThree: [],
    });
     this.requestData();
  },
  swiperChange:function(e){
    let mType = this.judgeType(e.detail.current);
    this.setData({
      currentTab: e.detail.current,
      paramType: mType
    });
    this.judgeLoad();
  },
  swichTab:function(e){
    let cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab: cur,
    });
  },
  judgeLoad:function(){
    if(this.data.currentTab == 0){
      if (this.data.dataListOne.length == 0) {
        wx.showLoading({
          title: '加载中...',
        });
        this.requestData();
      }else{
        return;
      }
    } else if (this.data.currentTab == 1){
      if (this.data.dataListTwo.length == 0) {
        wx.showLoading({
          title: '加载中...',
        });
        this.requestData();
      } else {
        return;
      }
    }else{
      if (this.data.dataListThree.length == 0) {
        wx.showLoading({
          title: '加载中...',
        });
        this.requestData();
      } else {
        return;
      }
    }
  },
  requestData:function(){
    let that = this;
    let current = that.data.currentTab;
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
        type:that.data.paramType
      },
      success:function(res){
        wx.hideLoading();
        if(that.data.currentTab == 0){
          that.setData({
            dataListOne: res.data.data
          });
          if (res.data.data.length == 0){
            that.setData({
              oneNoe: true
            });
          }
        } else if (that.data.currentTab == 1){
          that.setData({
            dataListTwo: res.data.data
          });
          if (res.data.data.length == 0) {
            that.setData({
              twoNoe: true
            });
          }
        }else{
          that.setData({
            dataListThree: res.data.data
          });
          if (res.data.data.length == 0) {
            that.setData({
              threeNoe: true
            });
          }
        }
      }
    })
  },
  judgeType:function(current){
    let tType = "";
    if (current == 0) {
      tType = "1";
    } else if (current == 1) {
      tType = "2";
    } else {
      tType = "3";
    }
    return tType;
  },
  toDetail:function(e){
    let audit = e.currentTarget.dataset.auditId;
    let currentNode = e.currentTarget.dataset.currentNode;
    wx.navigateTo({
      url: '../attenReviewDetail/attenReviewDetail?auditId=' + audit + '&currentNode=' + currentNode,
    });
  }
})