// pages/house/followup/followup.js
const head = require('../../../utils/api.js');
const recordList = "/mobile/house/recordList";
const addRecord = "/mobile/house/addRecord";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: [
      { name: '0', value: '跟进', checked: 'true'},
      { name: '1', value: '空看' },
    ],
    selectType:"0",
    recordList:[],
    top:[
      { name: 'top', value: '置顶'}
    ],
    topType:"0",
    bindFormSubmit:"",
  },
  onLoad: function (options) {
    this.setData({
      houseId: options.houseId
    });
    this.requestData();
  },
  radioChange: function (e) {
    this.setData({
      selectType: e.detail.value
    })
  },
  checkboxChange: function (e) {
    if (e.detail.value == "top"){
      let str = "";
      str += "(1)产权情况:\n";
      str += "(2)产权人:\n";
      str += "(3)是否有共有产权人:\n";
      str += "(4)产权证登记面积:\n";
      str += "(5)是否有银行贷款:\n";
      str += "(6)如何解押:\n";
      str += "(7)付款方式有何要求:\n";
      str += "(8)是否沟通钥匙:\n";
      str += "(9)是否沟通预约看房时间:\n";
      str += "(10)是否沟通速效:\n";
      str += "(11)业主卖房原因:\n";
      str += "(12)看房提前预约:\n";
      str += "(13)交房时间:\n";
      str += "(14)家私电器:\n";
      str += "(15)如有租约落实租期和租金:\n";
      str += "(16)装修:\n";   
      this.setData({
        bindFormSubmit: str,
        topType:"1"
      })
    }else{
      this.setData({
        bindFormSubmit: "",
        topType: "0"
      })
    }
  },
  bindFormSubmit: function (e) {
    this.setData({
      bindFormSubmit: e.detail.value
    })
  },
  requestData: function () {
    let that = this;
    let url = head.header + recordList;
    let userInfo = wx.getStorageSync("userInfo");
    let para = {
      openId: userInfo.openId,
      houseId:that.data.houseId
    };
    wx.request({
      url: url,
      data: para,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        var recordList = res.data.recordList;
        that.setData({
          recordList: recordList
        })
      }
    })
  },
   /**
   * 添加新的跟进
   */
  addfollow: function () {
    let that = this;
    let url = head.header + addRecord;
    let userInfo = wx.getStorageSync("userInfo");
    let para = {
      openId: userInfo.openId,
      houseId: that.data.houseId,    
      top: that.data.topType,
      type: that.data.selectType,
      remark: that.data.bindFormSubmit,
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
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
    this.setData({
      bindFormSubmit: "",
      topType: "0",
      selectType:"0",
    })
    
  },

})