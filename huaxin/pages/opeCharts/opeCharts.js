import * as echarts from '../../components/ec-canvas/echarts.min';
let head = require('../../utils/api.js');
let calc = require('../../utils/util.js');
let color = ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F", "#33A2DA", "#32C5D9", "#139DF8", "#1DF077", "#BDEE10", "#F47B11", "#68A6EA", "#1D74AE", "#AA34F3", "#F327B2", "#0CB18D", "#1D7774", "#77291D", "#8631F8"];
let sellChart = null;
let recentChart = null;
let cusChart = null;
Page({
  data: {
    ecSell: {
      onInit: function (canvas, width, height) {
          sellChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(sellChart);
        return sellChart;
      }
    },
    ecRecent: {
      onInit: function (canvas, width, height) {
          recentChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(recentChart);
        return recentChart;
      }
    },
    ecCustomer: {
      onInit: function (canvas, width, height) {
        cusChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(cusChart);
        return cusChart;
      }
    },
    isSellLoad:false,
    isRentLoad: false,
    isCusLoad: false,
    date:"",
    openId:"",
    token:"",
    currentTab: 0,
    winHeight:"",
    tagDeptId:"0",
    begTime:"2018-09-24",
    endTime:"2018-09-28",
    sellIndex: 0,
    sellArray: ["新增", "房堪","钥匙","独家","跟进","成交"],
    sellType: ["sellHouseAddNum", "sellHousePhotoNum", "sellHouseKeyNum", "sellHouseExclusiveNum", "sellHouseRecordNum","sellOrderNum"],
    rentIndex: 0,
    rentArray: ["新增", "房堪", "钥匙", "独家", "跟进", "成交"],
    rentType: ["rentHouseAddNum", "rentHousePhotoNum", "rentHouseKeyNum", "rentHouseExclusiveNum", "rentHouseRecordNum", "rentOrderNum"],
    cusIndex: 0,
    cusArray: ["新增", "带看", "跟进"],
    cusType: ["custAddNum", "custLookNum", "custRecordNum"],
    sellTable:[],
    rentTable: [],
    cusTable: [],
  },
  onLoad:function(options){
    wx.showLoading({
      title: '加载中...',
    });
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      openId: userInfo.openId,
      token: userInfo.token,
      winHeight: calc.calc
    });
    this.requestData();
  },
  beginDateChange:function(e){
    this.setData({
      date: e.detail.value
    });
  },
  swichTab: function (e) {
    let cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab: cur,
    });
  },
  swiperChange: function (e) {
    let current = e.detail.current;
    this.setData({
      currentTab: current,
    });
    this.judgeLoad(current);
  },
  judgeLoad: function (current){
    let that = this;
    if (current == 0) {
      if(that.data.isSellLoad){
        return;
      }else{
        wx.showLoading({
          title: '加载中...',
        });
        that.requestData();
      }
    } else if (current == 1) {
      if (that.data.isRentLoad) {
        return;
      } else {
        wx.showLoading({
          title: '加载中...',
        });
        that.requestData();
      }
    } else {
      if (that.data.isCusLoad) {
        return;
      } else {
        wx.showLoading({
          title: '加载中...',
        });
        that.requestData();
      }
    }
  },
  requestData:function(){
    let that = this;
    let data = {};
    let houseType = "";
    if(that.data.currentTab == 0){
      that.setData({
        isSellLoad:true
      });
      houseType = that.data.sellType[that.data.sellIndex];
    } else if (that.data.currentTab == 1){
      that.setData({
        isRentLoad: true
      });
      houseType = that.data.rentType[that.data.rentIndex];
    }else{
      that.setData({
        isCusLoad: true
      });
      houseType = that.data.cusType[that.data.cusIndex];
    }
    wx.request({
      url: head.header + '/mobile/house/operationList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: that.data.openId,
        token: that.data.token,
        tagDeptId: that.data.tagDeptId,
        begTime: that.data.begTime,
        endTime: that.data.endTime,
        cj: "2",
        wd: "3",
        houseType: houseType,
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          isLoad:true
        });
        console.log(res);
        let chart = "";
        if (that.data.currentTab == 0) {
          chart = sellChart;
          that.setData({
            sellTable: res.data.dlist
          });
        } else if (that.data.currentTab == 1) {
          chart = recentChart;
          that.setData({
            rentTable: res.data.dlist
          });
        } else {
          chart = cusChart;
          that.setData({
            cusTable: res.data.dlist
          });
        }
        chart.setOption({
          backgroundColor: "#ffffff",
          color: color,
          series: [{
            label: {
              normal: {
                fontSize: 14
              }
            },
            type: 'pie',
            center: ['50%', '50%'],
            radius: [0, '60%'],
            data: res.data.list,
            itemStyle: {
              normal: {
                label: {
                  formatter: "{b}\n{c}\n{d}%",
                  show: true
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 2, 2,0.3)'
              }
            }
          }]
        });
      }
    })
  },
  bindPickerChange:function(e){
    this.setData({
      sellIndex: e.detail.value,
    });
    this.requestData();
  },
  rentPickerChange:function(e){
    this.setData({
      rentIndex: e.detail.value,
    });
    this.requestData();
  },
  cusPickerChange:function(e){
    this.setData({
      cusIndex: e.detail.value,
    });
    this.requestData();
  },
  /*获取时间工具函数*/
  //dates为数字类型，0代表今日,-1代表昨日，1代表明日，返回yyyy-mm-dd格式字符串，dates不传默认代表今日。
  getDate: function (dates){
    let dd = new Date();
    let n = dates || 0;
    dd.setDate(dd.getDate() + n);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;
    let d = dd.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    let day = y + "-" + m + "-" + d;
    return day;
  },
   //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
  getMonday: function (type, dates){
    let now = new Date();
    let nowTime = now.getTime();
    let day = now.getDay();
    let longTime = 24 * 60 * 60 * 1000;
    let n = longTime * 7 * (dates || 0);
    if (type == "s") {
      let dd = nowTime - (day - 1) * longTime + n;
    };
    if (type == "e") {
      let dd = nowTime + (7 - day) * longTime + n;
    };
    dd = new Date(dd);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;
    let d = dd.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    let res = y + "-" + m + "-" + d;
    return res;
  },
  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，months为数字类型，0代表本月，-1代表上月，1代表下月
  getMonth: function (type, months){
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    if (Math.abs(months) > 12) {
      months = months % 12;
    };
    if (months != 0) {
      if (month + months > 12) {
        year++;
        month = (month + months) % 12;
      } else if (month + months < 1) {
        year--;
        month = 12 + month + months;
      } else {
        month = month + months;
      };
    };
    month = month < 10 ? "0" + month : month;
    let date = d.getDate();
    let firstday = year + "-" + month + "-" + "01";
    let lastday = "";
    if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
      lastday = year + "-" + month + "-" + 31;
    } else if (month == "02") {
      if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
        lastday = year + "-" + month + "-" + 29;
      } else {
        lastday = year + "-" + month + "-" + 28;
      };
    } else {
      lastday = year + "-" + month + "-" + 30;
    };
    let day = "";
    if (type == "s") {
      day = firstday;
    } else {
      day = lastday;
    };
    return day;
  }
});