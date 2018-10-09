let head = require('../../utils/api.js');
let subUrl = "/mobile/audit/sendAtendApply"
Page({
  data: {
    applyType:"1",
    index:0,
    array:["请假","异常"],
    vicalation:[{
      value: 11,
      text:"事假",
      checked:true
    },{
      value: 12,
      text: "病假"
    },{
      value: 6,
      text: "调休"
    }],
    unusual: [{
      value: 5,
      text: "外出",
      checked: true
    }, {
      value: 13,
      text: "忘打卡"
    }],
    begValue:"",
    endValue:"",
    date:"",
    str:"",
  },
  onLoad: function (options) {
    if (options.begTime == ""){
      this.setData({
        begValue: options.beginModel.substring(0, options.beginModel.length - 3),
      });
    }else{
      this.setData({
        begValue: options.begTime.substring(0, options.begTime.length - 3),
      });
    }
    if (options.endTime == "") {
      this.setData({
        endValue: options.endModel.substring(0, options.endModel.length - 3),
      });
    } else {
      this.setData({
        endValue: options.endTime.substring(0, options.begTime.length - 3),
      });
    }
    this.setData({
      date: options.workDate,
      str: options.staStr
    });
  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    });
    if (e.detail.value == 0){
      this.setData({
        applyType:"1"
      })
    } else if (e.detail.value == 1){
      this.setData({
        applyType: "2"
      })
    }
  },
  radioChange:function(e){
  },
  cancle:function(){
    wx.navigateBack({});
  },
  formSubmit:function(e){
    let userInfo = wx.getStorageSync("userInfo");
    if (e.detail.value.leaveRemark.length == 0){
      wx.showToast({
        title: '请输入事由',
        icon:'success',
        duration:2000
      })
    }else{
      wx.showLoading({
        title: '提交中...',
      })
      let url = head.header + subUrl;
      wx.request({
        url: url,
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          openId:userInfo.openId,
          token: userInfo.token,
          leaveType: e.detail.value.leaveType,
          begTime: e.detail.value.begTime,
          endTime: e.detail.value.endTime,
          leaveRemark: e.detail.value.leaveRemark
        },
        success:function(res){
          if(res.data.success){
            wx.hideLoading();
            wx.showToast({
              title: '提交成功',
            });
            setTimeout(function(){
              wx.navigateBack({})
            },1500);
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '提交失败',
            });
          }
        }
      })
    }
  }
})