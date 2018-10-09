let head = require('../../utils/api.js');
Page({
  data: {
    more:[
      {
        title: "房源",
        content: [
          {
            imgUrl: head.header + "/../../images/app/hotel.png",
            text: "买卖房源",
            naviUrl: "../house/houseList/houseList?houseType=1"
          }, {
            imgUrl: head.header + "/../../images/app/hotel.png",
            text: "租赁房源",
            naviUrl: "../house/houseList/houseList?houseType=2"
          }
        ]
      },
      {
        title:"考勤",
        content:[
          {
            imgUrl: head.header + "/../../images/app/beauty.png",
            text: "我的考勤",
            naviUrl: "../attenList/attenList"
          }, {
            imgUrl: head.header + "/../../images/app/default.png",
            text: "异常申请",
            naviUrl: "../applyList/applyList"
          }, {
            imgUrl: head.header + "/../../images/app/hotel.png",
            text: "考勤审核",
            naviUrl: "../attenReviewList/attenReviewList"
          }
        ]
      },
      {
        title: "账号",
        content: [
          {
            imgUrl: head.header + "/../../images/app/password.png",
            text: "修改密码",
            naviUrl: "../changePassword/changePassword"
          }, {
            imgUrl: head.header + "/../../images/app/headImg.png",
            text: "修改头像",
            naviUrl: "../changHead/changHead"
          }, {
            imgUrl: head.header + "/../../images/app/logout.png",
            text: "退出登录",
            naviUrl: "../logs/logs"
          }
        ]
      }
    ]
  },
  navitageToList:function(e){
    let naviUrl = e.currentTarget.dataset.naviUrl;
    if (naviUrl == '../logs/logs'){
      wx.clearStorageSync();
    };
    wx.navigateTo({
      url: naviUrl,
    })
  }
})