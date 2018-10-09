let head = require('../../utils/api.js');
let rpxR = require('../../utils/util.js');
Page({
  data: {
    type:"",
    meaasgeUrl:{
      houseAdd:"/mobile/house/houseDetail",
      houseUpdate:"/mobile/audit/checInfokByHouseUpdate",
      photo:"/mobile/house/aPhotoByHouseId",
      exclusive:"",
      key:"/mobile/audit/queryKeyByCheck",
      lookAdd:"/mobile/audit/lookAddDetail",
      newLookAdd:"/mobile/audit/newLookAddDetail",
      reviewSubmit:"/mobile/audit/houseChecked",
      reviewRecord:"/mobile/audit/houseChecking"
    },
    messageData:"",
    recordData:"",
    inputRemark:"",
    subCheckId:"",
    subType:"",
    openId:"",
    imgData:[],
    token:"",
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
    if (options.type == "HOUSE_ADD"){
      this.setData({
        subCheckId: options.checkid,
        subType:"house"
      })
      url = head.header + this.data.meaasgeUrl.houseAdd;
      param = {
        openId:userInfo.openId,
        token: userInfo.token,
        houseId: options.houseid
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.checkid,
        type:"house"
      };
    } else if (options.type == "HOUSE_UPDATE"){
      this.setData({
        subCheckId: options.checkid,
        subType: "house"
      })
      url = head.header + this.data.meaasgeUrl.houseUpdate;
      param = {
        openId: userInfo.openId,
        token: userInfo.token,
        houseId: options.houseid,
        checkId:options.checkid
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.checkid,
        type: "house"
      };
    } else if (options.type == "KEY") {
      this.setData({
        subCheckId: options.houseCheckId,
        subType: "house"
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
    } else if (options.type == "PHOTO") {
      this.setData({
        subCheckId: options.checkid,
        subType: "house"
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
    } else if (options.type == "JF_LOOK_ADD") {
      this.setData({
        subCheckId: options.customerCheckId,
        subType: "cust"
      })
      url = head.header + this.data.meaasgeUrl.lookAdd;
      param = {
        openId:userInfo.openId,
        token: userInfo.token,
        customerCheckId:options.customerCheckId
      };
      reviewParam = {
        openId: userInfo.openId,
        token: userInfo.token,
        checkId: options.customerCheckId,
        type: "cust"
      };
    } else if (options.type == "JF_NEWLOOK_ADD"){
      this.setData({
        subCheckId: options.customerCheckId,
        subType: "cust"
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
    } else if (options.type == "EXCLUSIVE") {
      url = head.header + this.data.meaasgeUrlexclusive;
    }
    this.getMessage(url, param);
    this.getReviewRecord(reviewParam);
  },
  getMessage:function(url,param){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: url,
      data:param,
      success:function(res){
        wx.hideLoading();
        that.setData({
          messageData:res.data
        });
        if (that.data.type == "HOUSE_UPDATE"){
          let updateData = res.data;
          updateData.houseHistory.record = updateData.houseHistory.record.replace(new RegExp("<br/>", "gm"),"\n");
          that.setData({
            messageData: updateData
          });
        }
        if (that.data.type == "PHOTO"){
          let imgArr = [];
          for (let i = 0; i < res.data.photoList.length; i++){
            let imgUrl = head.header + '/mobile/img?imgUrl=' + res.data.photoList[i].seq + '&openId=' + that.data.openId + '&token=' + that.data.token;
            wx.getImageInfo({
              src: imgUrl,
              success: function (result) {
                let imgWidth = result.width ,
                  imgHeight = result.height ;
                let showHeight = imgHeight / imgWidth * 750;
                let url = {
                  url: imgUrl,
                  height: showHeight
                }; 
                imgArr.push(url);
                that.setData({
                  imgData: imgArr
                });
              }
            });
          }
        }
      }
    });
  },
  getReviewRecord:function(reviewParam){
    let that = this;
    let url = head.header + that.data.meaasgeUrl.reviewRecord;
    wx.request({
      url: url,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: reviewParam,
      success:function(res){
        that.setData({
          recordData:res.data.list
        });
      }
    })
  },
  inputAdvice:function(e){
    this.setData({
      inputRemark:e.detail.value
    })
  },
  bindAgree:function(){
    wx.showLoading({
      title: '提交中...',
    });
    let that = this;
    let userInfo = wx.getStorageSync("userInfo"); 
    let subParam = {
      openId: userInfo.openId,
      token: userInfo.token,
      checkId: that.data.subCheckId,
      remark: that.data.inputRemark,
      type:that.data.subType,
      result:"1"
    };
    that.remarkRequest(subParam);
  },
  bindRefuse:function(){
    wx.showLoading({
      title: '提交中...',
    });
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let refuseParam = {
      openId: userInfo.openId,
      token: userInfo.token,
      checkId: that.data.subCheckId,
      remark: that.data.inputRemark,
      type: that.data.subType,
      result: "2"
    };
    that.remarkRequest(refuseParam);
  },
  remarkRequest:function(param){
    let that = this;
    let url = head.header + that.data.meaasgeUrl.reviewSubmit;
    wx.request({
      url: url,
      method:"Post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:param,
      success:function(res){
        wx.hideLoading();
        if(res.data.code == "0"){
          wx.showToast({
            title: '提交成功',
            icon: "success"
          });
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }else{
          wx.showToast({
            title: '提交失败,请联系管理员!',
            icon: "none"
          });
        }
      }
    })
  },
  bigImg:function(e){
    let that = this;
    let arrx = [];
    for(let i = 0; i<that.data.imgData.length; i++){
      arrx.push(that.data.imgData[i].url);
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: arrx
    });
  }
})