// pages/house/houseDetail/housDetail.js
const head = require('../../../utils/api.js');
const houseDetail = "/mobile/house/houseDetail";
const centerSrc = "/mobile/img?imgUrl=";
const housePhoto = "/mobile/house/photoByHouseId"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //src: '../../../image/house1.png',
    houseDetail:[],
    houseId:"",
    src: "",
    centerSrc: centerSrc,
    head: head.header,
    openId: "",
    photoList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //houseId: options.houseId
      houseId:"H20180912111001"
    });
    this.requestData()
    this.requestPhoto()
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  requestData: function () {
    let that = this;
    let url = head.header + houseDetail;
    let userInfo = wx.getStorageSync("userInfo");
    that.setData({
      openId: userInfo.openId
    })
    let para = {    
      openId: userInfo.openId,
      houseId: that.data.houseId
    };
    wx.request({
      url: url,
      data: para,
      success: function (res) {
        var houseDetail = res.data.house;     
        that.setData({
          houseDetail: houseDetail,
          //src: res.data.url
        })
      }
    })
  },
  requestPhoto: function () {
    let that = this;
    let url = head.header + housePhoto;
    let para = {
      openId: that.data.openId,
      houseId: that.data.houseId
    };
    wx.request({
      url: url,
      data: para,
      success: function (res) {
        var photoList = res.data.photoList;
        that.setData({
          photoList: photoList,
          src: res.data.url
        })
      }
    })
  },
  //大图
  bigImg: function (e) {
    let that = this;
    let arrx = [];
    for (let i = 0; i < that.data.photoList.length; i++) {
      arrx.push(that.data.head + that.data.centerSrc + that.data.src + that.data.photoList[i].houseId + '/' + that.data.photoList[i].path + '&' + 'openId=' + that.data.openId);
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: arrx,
    })
  },
  //跳转
  toFollow: function (e) {
    wx.navigateTo({
      url: '../followup/followup?houseId=' + this.data.houseId,
    })
  }, 
  tokey: function (e) {
    wx.navigateTo({
      url: '../houseKey/houseKey?houseId=' + this.data.houseId + '&houseType=' + this.data.houseDetail.houseType +'&isKey=' +this.data.houseDetail.isKey,
    })
  },
  toLook: function (e) {
    wx.navigateTo({
      url: '../houseLook/houseLook?houseId=' + this.data.houseId,
    })
  }, 
 
  
})