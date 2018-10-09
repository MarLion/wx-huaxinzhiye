let head = require('../../utils/api.js');
Page({
  data: {
    type: "",
    orderUrl: "/mobile/house/orderDetail",
    houseUrl:"/mobile/house/houseDetail",
    recviewSubmit:"/mobile/audit/houseChecked",
    reviewRecord:"/mobile/audit/checkInfoByAuditId",
    reviewPhoto:"/mobile/house/orderPhotoApp",
    messData:"",
    houseData:"",
    osList:"",
    isRent:"",
    recordData:"",
    inputRemark:"",
    orderCheckId:"",
    openId:"",
    imgData:[],
    token:"",
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      type: options.type,
      orderCheckId: options.orderCheckId,
      openId:userInfo.openId,
      token: userInfo.token
    });
    this.getOrderDetail(userInfo.openId, options.orderId, userInfo.token);
    this.getOrderPhoto(userInfo.openId, options.orderId, userInfo.token);
    this.getReviewRecord(userInfo.openId, options.orderAudit, userInfo.token)
  },
  getOrderDetail: function (openid, param, token){
    let that = this;
    let url = head.header + that.data.orderUrl;
    wx.request({
      url: url,
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        openId: openid,
        orderId:param,
        token: token
      },
      success:function(res){
        that.setData({
          messData:res.data,
          osList: res.data.osList,
          isRent: res.data.order.orderType
        });
        that.getHouseMes(res.data.order.houseId, openid, token);
      }
    })
  },
  getHouseMes: function (houseid, openid, token){
    let that = this;
    let url = head.header + that.data.houseUrl;
    wx.request({
      url: url,
      data:{
        openId:openid,
        houseId:houseid,
        token: token
      },
      success:function(res){
        wx.hideLoading();
        that.setData({
          houseData:res.data
        })
      }
    })
  },
  getOrderPhoto: function (openId, orderId, token){
    let that = this;
    let url = head.header + that.data.reviewPhoto;
    wx.request({
      url: url,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        openId:openId,
        orderId:orderId,
        token: token
      },
      success:function(res){
        let imgArr = [];
        for (let i = 0; i < res.data.photoList.length; i++) {
          let imgUrl = head.header + '/mobile/img?imgUrl=' + res.data.photoList[i].seq + '&openId=' + that.data.openId + '&token=' + that.data.token;
          wx.getImageInfo({
            src: imgUrl,
            success: function (result) {
              let imgWidth = result.width,
                imgHeight = result.height;
              let showHeight = imgHeight / imgWidth * 750;
              let url = {
                url: imgUrl,
                height: showHeight
              };
              imgArr.push(url);
              that.setData({
                imgData: imgArr
              });
            },
            fail:function(e){
              console.log(e);
            }
          });
        }
      }
    })
  },
  getReviewRecord: function (openid, auditid, token){
    let that = this;
    let url = head.header + that.data.reviewRecord;
    wx.request({
      url: url,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        openId:openid,
        auditId: auditid,
        token: token
      },
      success:function(res){
        that.setData({
          recordData: res.data.ocList
        })
      }
    })
  },
  inputAdvice: function (e) {
    this.setData({
      inputRemark: e.detail.value
    })
  },
  bindAgree: function () {
    wx.showLoading({
      title: '提交中...',
    });
    let that = this;
    let userInfo = wx.getStorageSync("userInfo")
    let subParam = {
      openId: userInfo.openId,
      checkId: that.data.orderCheckId,
      remark: that.data.inputRemark,
      type: "order",
      result: "1",
      token: that.data.token
    };
    that.remarkRequest(subParam);
  },
  bindRefuse: function () {
    wx.showLoading({
      title: '提交中...',
    });
    let that = this;
    let userInfo = wx.getStorageSync("userInfo")
    let refuseParam = {
      openId: userInfo.openId,
      checkId: that.data.orderCheckId,
      remark: that.data.inputRemark,
      type: "order",
      result: "2",
      token: that.data.token
    };
    that.remarkRequest(refuseParam);
  },
  remarkRequest: function (param) {
    let that = this;
    let url = head.header + that.data.recviewSubmit;
    wx.request({
      url: url,
      method: "Post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: param,
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: "success"
        });
        if (res.data.code == "0") {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '提交失败,请联系管理员!',
            icon: "none"
          });
        }
      }
    })
  },
  bigImg: function (e) {
    let that = this;
    let arrx = [];
    for (let i = 0; i < that.data.imgData.length; i++) {
      arrx.push(that.data.imgData[i].url);
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: arrx
    })
  }
})