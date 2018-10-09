let head = require('../../utils/api.js');
let applyUrl = "/mobile/audit/myAtendApply";
Page({
  data: {
    currentTab:0,
    winHeight:"",
    ingPage:1,
    edPage:1,
    rows:10,
    openId:"",
    token:"",
    result:0,
    reviewingList:[],
    reviewedList:[],
    scrollTop:0,
    noIngMore:false,
    noEdMore: false,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    });
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    that.setData({
      openId: userInfo.openId,
      token: userInfo.token
    })
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth; 
        let calc = clientHeight * rpxR-80;
        that.setData({
          winHeight:calc
        })
      },                                                                                                                              
    });
  },
  onShow:function(){
    this.setData({
      reviewingList: [],
      reviewedList: []
    })
    this.requestData();
  },
  judgeLoad:function(){
    if (this.data.currentTab == 0) {
      if (this.data.reviewingList.length == 0) {
        wx.showLoading({
          title: '加载中...'
        });
        this.requestData();
      } else {
        return
      }
    } else {
      if (this.data.reviewedList.length == 0) {
        wx.showLoading({
          title: '加载中...'
        });
        this.requestData();
      } else {
        return
      }
    }
  },
  swichTab:function(e){
    let cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab:cur,
      result:cur
    });
  },
  swiperChange:function(e){
    this.setData({
      currentTab: e.detail.current,
      result:e.detail.current
    });
    this.judgeLoad();
  },
  requestData: function (userInfo){
    let that = this;
    let url = head.header + applyUrl;
    let para = {};
    if(that.data.currentTab == 0){
      para = {
        openId: that.data.openId,
        token: that.data.token,
        page: that.data.ingPage,
        rows: that.data.rows,
        result: that.data.result
      }
    }else{
      para = {
        openId: that.data.openId,
        token: that.data.token,
        page: that.data.edPage,
        rows: that.data.rows,
        result: that.data.result
      }
    }
    wx.request({
      url: url,
      data:para,
      success:function(res){
        wx.hideLoading();
        let message = res.data.list;
        if(that.data.currentTab == 0){
          let ingList = that.data.reviewingList;
          for(let i = 0;i<message.length;i++){
            ingList.push(message[i]);
          }
          that.setData({
            reviewingList: ingList
          });
          if(ingList.length == res.data.total){
            that.setData({
              noIngMore:true
            });
          }
        }else{
          let edList = that.data.reviewedList;
          for (let i = 0; i < message.length; i++) {
            edList.push(message[i]);
          }
          that.setData({
            reviewedList: edList
          });
          if (edList.length == res.data.total) {
            that.setData({
              noEdMore: true
            });
          }
        }
      }
    })
  },
  topLoad:function(){
    wx.showLoading({
      title: '加载中...'
    });
    let that = this;
    if(that.data.currentTab == 0){
      that.setData({
        reviewingList:[],
        ingPage:1
      })
    }else{
      that.setData({
        reviewedList: [],
        edPage:1
      })
    }
    this.requestData();
  },
  bindDownLoad:function(){
    wx.showLoading({
      title: '加载中...'
    });
    let that = this;
    if(that.data.currentTab == 0){
      that.setData({
        ingPage:that.data.ingPage+1
      })
    }else{
      that.setData({
        edPage: that.data.edPage+1
      })
    }
    this.requestData();
  },
  scroll: function (event) {
    this.setData({
      scrollTop : event.detail.scrollTop
    });
  },
  toDetail:function(e){
    wx.navigateTo({
      url: '../applyDetail/applyDetail?auditId=' + e.currentTarget.dataset.auditId,
    })
  }
})