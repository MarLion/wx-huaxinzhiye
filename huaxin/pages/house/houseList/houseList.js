let head = require('../../../utils/api.js');
let houseList = "/mobile/house/houseList";
let centerSrc = "/mobile/img?imgUrl=";

Page({
  /**
   * 页面的初始数据
   */
  data: {    
    //src: '../../../image/house1.png',
    src:"",  
    centerSrc: centerSrc,
    head: head.header,
    houseType:"",
    openId: "",
    houseList:[],
    ingPage: 1,
    pageSize:10,
    scrollTop: 0,   
    areashow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    priceshow: false,
    roomshow: false,
    moreshow:false,
    areaSelect: ['全部','洪山', '武昌', '江夏', '江岸', '江汉', '硚口','青山','汉阳','沌口开发区','黄陂','蔡甸','汉南','东湖高新区','新洲','东西湖'],//下拉列表的数据
    areaNum: ['A20180316161001', 'A20180316161002', 'A20180316161003', 'A20180316161004', 'A20180316161005', 'A20180316161006', 'A20180316161007', 'A20180316161008', 'A20180316161009', 'A201803161610010', 'A201803161610011', 'A201803161610012', 'A201803161610013', 'A201803161610014', 'A201803161610015'],
    priceSelect: ['100万以下', '100-150万', '150-200万', '200-250万', '250-300万', '300-400万', '400万以上'],
    priceSentSelect: ['500元以下', '500-1000元', '1000-1500元', '1500-2000元', '2000-3000元', '3000-4000元', '4000元以上'],
    roomSelect: ['50㎡以下', '50-80㎡', '80-110㎡', '110-150㎡', '150-200㎡', '200-300㎡', '300㎡以上'],
    bedroomSelect: ['1室', '2室', '3室', '4室', '5室', '5室以上'],
    stateSelect: ['有效', '无效', '已成交'],
    faceSelect:['东','西','南','北','东南','西南','东北','西北','南北','东西'],
    //lableSelect:['不限','满五唯一','掌上沪华信','VIP服务','聚焦','地铁房','家具','家电','学区房','推荐购买'],
    entrustTypeSelect:['网络盘','非网络盘'],
    area: "",//地区的值
    priceMax:"",
    priceMin:"",
    roomMax: "",
    roomMin: "",
    state:"",
    bedroomMin:"",
    bedroomMax:"",
    face:"",
    entrustType:"",
    areaCheck: "101", //判断是否选中
    priceCheck: "101",
    roomCheck:"101",
    bedroomCheck:"101",
    stateCheck:"101",
    faceCheck:"101",
    entrustTypeCheck:"101",
    communityName: "",
  },
  onLoad: function (options) { 
    this.setData({
      houseType: options.houseType
    });
    this.requestData();
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中...'
    });
    var that = this;
    that.setData({
      reviewingList: [],
      ingPage: 1
    })
    this.requestData();
  },
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...'
    });
    var that = this;
    if (that.data.ingPage)
    that.setData({
      ingPage: that.data.ingPage + 1
    })
    this.requestData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 加载更多数据
   */  
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  /**
   * 请求数据
   */
  requestData: function () {
    let that = this;
    let url = head.header + houseList;
    let userInfo = wx.getStorageSync("userInfo");
    that.setData({
      openId: userInfo.openId
    })
    let para = {
      pageNo: that.data.ingPage,
      pageSize: that.data.pageSize,
      houseType: that.data.houseType,
      openId: userInfo.openId,   
      areaId: that.data.area,
      priceMin: that.data.priceMin,
      priceMax: that.data.priceMax,
      acreageMin: that.data.roomMin,
      acreageMax: that.data.roomMax,
      bedroomMin: that.data.bedroomMin,
      bedroomMax: that.data.bedroomMax,
      face: that.data.face, 
      houseState: that.data.state, 
      entrustType: that.data.entrustType, 
      communityName: that.data.communityName
    };    
    wx.request({
      url: url,
      data: para,
      success: function (res) {
        wx.hideLoading();
        var list = that.data.houseList;
        for (var i = 0; i < res.data.houseList.length; i++){
          list.push(res.data.houseList[i]);
        }
        that.setData({
          houseList: list,
          src: res.data.url
        })
      }
    })
  },

  //输入查找
  houseInput: function (e) {
    this.setData({
      communityName: e.detail.value
    })
  },
  findHouse:function(){
    console.log("111")
    this.setData({
      areaId: "",
      priceMin:"",
      priceMax: "",
      acreageMin: "",
      acreageMax: "",
      bedroomMin: "",
      bedroomMax: "",
      face: "",
      houseState: "",
      entrustType: "",
      ingPage: 1,
      houseList: []      
    })
    this.requestData()
    console.log("222")
  },

  //区域点击下拉列表
  areaTap: function() {
    this.setData({
      areashow: !this.data.areashow,
      priceshow: false,
      roomshow: false,
      moreshow: false,
    });
  },
  areaCheck: function(e) {
    let areaIndex = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let area = "";
    if (areaIndex == "0"){
       area = "";
    }else{
       area = this.data.areaNum[areaIndex-1]
    }   
    this.setData({
      area: area,
      areashow: !this.data.areashow,
      areaCheck: areaIndex,
      ingPage: 1,
      houseList:[]
    });
    this.requestData();
  },
  //售价点击下拉列表
  priceTap: function() {
    this.setData({
      priceshow: !this.data.priceshow,
      areashow: false,
      roomshow: false,
      moreshow: false,
    });
  },
  priceCheck: function(e) {
    let priceVal = e.currentTarget.dataset.val;//获取点击的下拉列表的下标
    let priceIndex = e.currentTarget.dataset.index;
    let priceMin = "" ;
    let priceMax = "";
    if (priceVal.indexOf("-") !== -1) {
      priceVal = priceVal.split("-");
      priceMin = priceVal[0];
      priceMax = priceVal[1].replace(/[^0-9]/ig, "");
    } else {
      if (priceVal.indexOf("以下") !== -1){
        priceMax = priceVal.replace(/[^0-9]/ig, "")
        priceMin = "";
      } else if (priceVal.indexOf("以上") !== -1){
        priceMin = priceVal.replace(/[^0-9]/ig, "");
        priceMax = "";
      }
    }
    this.setData({
      priceMin: priceMin,
      priceMax: priceMax,
      priceshow: !this.data.priceshow,
      priceCheck: priceIndex,
      ingPage: 1,
      houseList: []
    });
    this.requestData();
  },
  priceMin: function(e) {
    this.setData({
      priceMin: e.detail.value
    })
  },
  priceMax: function (e) {
    this.setData({
      priceMax: e.detail.value
    })
  },
  priceCancel: function (e){
    this.setData({
      priceMin: "",
      priceMax: "",
      priceshow: !this.data.priceshow,
      priceCheck: "101",
    });
    this.requestData();
  },
  pricedetermine: function (e) {
    this.setData({
      priceshow: !this.data.priceshow,
      ingPage: 1,
      houseList: []
    })
    this.requestData();
  },
  //面积列表点击下拉列表
  roomTap: function () {
    this.setData({
      roomshow: !this.data.roomshow,
      areashow: false,
      priceshow: false,
      moreshow: false,
    });
  },
  roomCheck: function (e) {
    let roomVal = e.currentTarget.dataset.val;//获取点击的下拉列表的下标
    let roomIndex = e.currentTarget.dataset.index;
    let roomMin = "";
    let roomMax = "";
    if (roomVal.indexOf("-") !== -1) {
      roomVal = roomVal.split("-");
      roomMin = roomVal[0];
      roomMax = roomVal[1].replace(/[^0-9]/ig, "");
    } else {
      if (roomVal.indexOf("以下") !== -1) {
        roomMax = roomVal.replace(/[^0-9]/ig, "")
        roomMin = "";
      } else if (roomVal.indexOf("以上") !== -1) {
        roomMin = roomVal.replace(/[^0-9]/ig, "");
        roomMax = "";
      }
    } 
    this.setData({
      roomMin: roomMin,
      roomMax: roomMax,
      roomshow: !this.data.roomshow,
      roomCheck: roomIndex,
      ingPage: 1,
      houseList: []
    });
    this.requestData();
  },
  roomMin: function (e) {
    this.setData({
      roomMin: e.detail.value
    })
  },
  roomMax: function (e) {
    this.setData({
      roomMax: e.detail.value
    })
  },
  roomCancel: function (e) {
    this.setData({
      roomMin: "",
      roomMax: "",
      roomshow: !this.data.roomshow,
      roomCheck: "101",
    });
    this.requestData();
  },
  roomdetermine: function (e) {
    this.setData({
      roomshow: !this.data.roomshow,
      ingPage: 1,
      houseList: []
    });
    this.requestData();
  },
  //更多点击下拉列表
  moreTap: function () {
    this.setData({
      moreshow: !this.data.moreshow,
      areashow: false,
      priceshow: false,
      roomshow: false,
    });
  },
  moreCancel: function (e) {
    this.setData({
      moreshow: !this.data.moreshow,
      state: "",
      bedroomMin: "",
      bedroomMax: "",
      face: "",
      entrustType: "",
      bedroomCheck: "101",
      stateCheck: "101",
      faceCheck: "101",
      entrustTypeCheck: "101",
    });
    this.requestData();
  },
  moredetermine: function (e) {
    this.setData({
      moreshow: !this.data.moreshow,
      ingPage: 1,
      houseList: []
    });
    this.requestData();
  },
  //房源状态
  stateCheck: function (e) {
    let stateIndex = e.currentTarget.dataset.index;
    this.setData({
      state: stateIndex,
      stateCheck: stateIndex,
    });
  },
  //房型
  bedroomCheck: function (e) {
    let bedroomval = e.currentTarget.dataset.val;//获取点击的下拉列表的下标
    let bedroomIndex = e.currentTarget.dataset.index;
    let bedroomMin = "";
    let bedroomMax = "";
    if (bedroomval == "5室以上"){
      bedroomMax = "";
      bedroomMin = bedroomval.replace(/[^0-9]/ig, "");    
    }else{
      bedroomMin = bedroomMax = bedroomval.replace(/[^0-9]/ig, "");
    }    
    this.setData({
      bedroomMin: bedroomMin,
      bedroomMax: bedroomMax,
      bedroomCheck: bedroomIndex,
    });
  },
  //房源状态
  faceCheck: function (e) {
    let faceIndex = e.currentTarget.dataset.index;
    this.setData({
      face: faceIndex+1,
      faceCheck: faceIndex,
    });
  },
  //网络盘和非网络盘
  entrustTypeCheck: function (e) {
    let entrustTypeIndex = e.currentTarget.dataset.index;
    this.setData({
      entrustType: entrustTypeIndex + 1,
      entrustTypeCheck: entrustTypeIndex,
    });
  },
  //跳转
  toDetail: function (e) {
    wx.navigateTo({
      url: '../houseDetail/housDetail?houseId=' + e.currentTarget.dataset.houseId,
    })
  }


})