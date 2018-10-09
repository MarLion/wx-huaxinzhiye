const head = require('../../../utils/api.js');
const keyList = "/mobile/house/queryKeyByHouseId";
const addKey = "/mobile/house/addKey";
const delKey = "/mobile/house/deleteKey";

Page({
  data: {
    keyNo:"",
    bindFormSubmit: "",
    keyList:[],
    keyshow : false,
    keyDel:false
  },
  onLoad: function (options) {
    this.setData({
      houseId: options.houseId,
      houseType: options.houseType,
      isKey: options.isKey,
    });
    if (options.isKey == '1'){
      this.setData({
        keyDel: true
      })
    }
    this.requestData();
  },
  keyNum: function (e) {
    this.setData({
      keyNo: e.detail.value
    })
  },
  /**
  * 备注
  */
  bindFormSubmit: function (e) {
    this.setData({
      bindFormSubmit: e.detail.value
    })
  },
  /**
  * 请求数据
  */
  requestData: function () {
    let that = this;
    let url = head.header + keyList;
    let userInfo = wx.getStorageSync("userInfo");
    let para = {
      openId: userInfo.openId,
      houseId: that.data.houseId,
      //houseType: that.data.houseType
    };
    wx.request({
      url: url,
      data: para,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        let key = res.data.keyList;
        if (key != ""){
          that.setData({
            keyshow :true
          })          
        }
        that.setData({
          keyList: key
        })
      }
    })
  },
  /**
  * 添加新的跟进
  */
  addfollow: function () {
    let that = this;
    let url = head.header + addKey;
    let userInfo = wx.getStorageSync("userInfo");
    let para = {
      openId: userInfo.openId,
      houseId: that.data.houseId,
      number: that.data.keyNo,
      remark: that.data.bindFormSubmit,
      houseType: that.data.houseType
    };
    wx.request({
      url: url,
      data: para,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {     
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        that.requestData();
      }
    })
    this.setData({
      bindFormSubmit: "",
      keyNo:""
    })
  },
  delKey:function(){
    if (this.data.keyList[0].checkType == "F") {
      wx.showToast({
        title: '存在待审核项,请稍后操作',
        icon: "none",
        duration: 2000
      })
    } else {
      let that = this;
      let url = head.header + delKey;
      let userInfo = wx.getStorageSync("userInfo");
      let para = {
        openId: userInfo.openId,
        houseId: that.data.houseId,
        houseType: that.data.houseType,
      };
      wx.request({
        url: url,
        data: para,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          that.requestData();
          wx.showToast({
            title: '已提交删除钥匙申请,审核通过后即可提交',
            icon: "none",
            duration: 5000
          })
          that.setData({
            keyDel:true
          })
        }
      })
    }
  },
  del:function(){
    if (this.data.keyList[0].checkType == "F") {
      wx.showToast({
        title: '存在待审核项,请稍后操作',
        icon: "none",
        duration: 2000
      })
    } else {
      this.setData({
        keyshow: false
      })
    }
     
  },
  
  cancel:function(){
    this.setData({
      keyshow: true
    })
    
  }

})