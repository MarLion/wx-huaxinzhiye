let head = require('../../utils/api.js');
let listUrl = "/mobile/manage/perAtendByMonth";
Page({
  data: {
    list:[],
    page:1,
    noMore:false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    });
    this.getAttenList();
  },
  getAttenList:function(){
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let url = head.header + listUrl;
    wx.request({
      url: url,
      data: {
        openId: userInfo.openId,
        token: userInfo.token,
        page: that.data.page,
        rows: 10
      },
      success: function (res) {
        wx.hideLoading();
        let attenList = that.data.list;
        let message = res.data.list;
        for(let i = 0; i < message.length; i++){
          attenList.push(message[i]);
        }
        that.setData({
          list: attenList
        });
        if (attenList.length == res.data.total) {
          that.setData({
            noMore: true
          });
        }
      }
    })
  },
  topLoad: function () {
    wx.showLoading({
      title: '加载中...'
    });
    let that = this;
    that.setData({
      list: [],
      page: 1
    });
    this.getAttenList();
  },
  bindDownLoad: function () {
    wx.showLoading({
      title: '加载中...'
    });
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    this.getAttenList();
  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  bindViewTap: function (e) {
    let month = e.currentTarget.dataset.chooseMonth;
    let userid = e.currentTarget.dataset.userId;
    wx.navigateTo({
      url: '../attendDetail/attendDetail?month=' + month + '&userId=' + userid
    })
  }
})