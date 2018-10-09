let head = require('../../utils/api.js');
Page({
  data: {
    type: "",
    meaasgeUrl: {
      houseAdd: "/mobile/house/houseDetail",
      houseUpdate: "/mobile/audit/checInfokByHouseUpdate",
      photo: "/mobile/house/aPhotoByHouseId",
      exclusive: "",
      key: "/mobile/audit/queryKeyByCheck",
      lookAdd: "/mobile/audit/lookAddDetail",
      newLookAdd: "/mobile/audit/newLookAddDetail",
      reviewSubmit: "/mobile/audit/houseChecked",
      reviewRecord: "/mobile/audit/houseChecking"
    },
    messageData: "",
    recordData: "",
    subCheckId: "",
    subType: "",
    showType:"",
    openId:"",
    token:"",
    imgData: [],
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo")
    let param = {};
    let reviewParam = {};
    this.setData({
      type: options.type,
      openId:userInfo.openId,
      token: userInfo.token
    });
    let url = "";
    if (options.type.indexOf("HOUSE_ADD") != -1) {
      this.setData({
        subCheckId: options.checkid,
        subType: "house",
        showType:0
      })
      url = head.header + this.data.meaasgeUrl.houseAdd;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        houseId: options.houseid
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.checkid,
        type: "house"
      };
    } else if (options.type.indexOf("HOUSE_UPDATE") != -1) {
      this.setData({
        subCheckId: options.checkid,
        subType: "house",
        showType: 1
      })
      url = head.header + this.data.meaasgeUrl.houseUpdate;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        houseId: options.houseid,
        checkId: options.checkid
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.checkid,
        type: "house"
      };
    } else if (options.type.indexOf("KEY") != -1) {
      this.setData({
        subCheckId: options.houseCheckId,
        subType: "house",
        showType: 2
      })
      url = head.header + this.data.meaasgeUrl.key;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        houseCheckId: options.houseCheckId
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.houseCheckId,
        type: "house"
      };
    } else if (options.type.indexOf("PHOTO") != -1) {
      this.setData({
        subCheckId: options.checkid,
        subType: "house",
        showType: 3
      })
      url = head.header + this.data.meaasgeUrl.photo;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        houseId: options.houseid
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.checkid,
        type: "house"
      };
    } else if (options.type.indexOf("JF_LOOK_ADD") != -1) {
      this.setData({
        subCheckId: options.customerCheckId,
        subType: "cust",
        showType: 4
      })
      url = head.header + this.data.meaasgeUrl.lookAdd;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        customerCheckId: options.customerCheckId
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.customerCheckId,
        type: "cust"
      };
    } else if (options.type.indexOf("JF_NEWLOOK_ADD") != -1) {
      this.setData({
        subCheckId: options.customerCheckId,
        subType: "cust",
        showType: 5
      })
      url = head.header + this.data.meaasgeUrl.newLookAdd;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        customerCheckId: options.customerCheckId
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.customerCheckId,
        type: "cust"
      };
    } else if (options.type.indexOf("EXCLUSIVE") != -1) {
      url = head.header + this.data.meaasgeUrlexclusive;
    }
    this.getMessage(url, param);
    this.getReviewRecord(reviewParam);
  },
  getMessage: function (url, param) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: url,
      data: param,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        that.setData({
          messageData: res.data
        });
        if (that.data.type.indexOf("HOUSE_UPDATE") != -1) {
          let updateData = res.data;
          updateData.houseHistory.record = updateData.houseHistory.record.replace(new RegExp("<br/>", "gm"), "\n");
          console.log(updateData.houseHistory.record)
          that.setData({
            messageData: updateData
          });
        }
        if (that.data.type.indexOf("PHOTO") != -1) {
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
      }
    })
  },
  getReviewRecord: function (reviewParam) {
    let that = this;
    let url = head.header + that.data.meaasgeUrl.reviewRecord;
    wx.request({
      url: url,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: reviewParam,
      success: function (res) {
        that.setData({
          recordData: res.data.list
        })
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