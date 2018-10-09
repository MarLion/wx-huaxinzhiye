let head = require('../../utils/api.js');
let requestUrl = "/mobile/manage/atendCalendar";
Page({
  data: {
    date: new Date(),
    isOpen: true,
    chooseMonth: "",
    calShow: true, // 日历组件是否打开
    dateShow: false, // 日期是否选择
    selectDay: '', // 当前选择日期
    canlender: {
      "weeks": []
    },
    userId: "",
    selected: [],
  },
  onLoad:function(options) {
    this.setData({
      userId: options.userId,
      chooseMonth: options.month
    });
    if (this.data.isOpen) {
      this.setData({
        calShow: false,
        dateShow: true
      })
    }
  },
  onShow:function(){
    this.requestData(this.data.chooseMonth);
  },
  selectDay(e) {
    let code = e.currentTarget.dataset.code;
    let applyCode = e.currentTarget.dataset.applyCode;
    if (code == "0" | code == undefined) {
      return;
    } else {
      if (applyCode == "1") {
        wx.showToast({
          title: '该条考勤已进行申请，请等待审核完成！',
          icon: 'none',
          duration: 3000
        })
      } else {
        wx.navigateTo({
          url: '../attenApply/attenApply?begTime=' + e.currentTarget.dataset.begTime + '&endTime=' + e.currentTarget.dataset.endTime + '&staStr=' + e.currentTarget.dataset.staStr + '&workDate=' + e.currentTarget.dataset.workDate + '&beginModel=' + e.currentTarget.dataset.beginModel + '&endModel=' + e.currentTarget.dataset.endModel,
        })
      }
    }
  },
  packup() {
    let self = this;
    wx.navigateBack({
      delta: 1
    });
  },
  // 返回今天
  backtoday() { this.getWeek(new Date()); },
  // 前一天|| 后一天
  dataBefor(e) {
    let num = 0;
    let types = e.currentTarget.dataset.type;
    if (e.currentTarget.dataset.id === "0") {
      num = -1;
    } else {
      num = 1
    }
    let year = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
    let _date = this.getDate(year, num, types === 'month' ? "month" : "day");
    this.requestData(_date);
  },
  // 获取日历内容
  getWeek(dateData, statuStrArr, statuArr, applyCode, begTime, endTime, workDate, begModel, endModel) {
    let stastus = statuStrArr;
    let staCode = statuArr;
    let applyArr = applyCode;
    let selected = this.data.selected;
    let begArr = begTime;
    let endArr = endTime;
    let dateArr = workDate;
    let begM = begModel;
    let endM = endModel;
    let a = new Date();
    let _date = new Date(dateData);
    let year = _date.getFullYear(); //年
    let month = _date.getMonth() + 1;  //月
    let date = _date.getDate();//日
    let day = _date.getDay();// 天
    let canlender = [];
    let dates = {
      firstDay: new Date(year, month - 1, 1).getDay(),
      lastMonthDays: [],// 上个月末尾几天
      currentMonthDys: [], // 本月天数
      nextMonthDays: [], // 下个月开始几天
      endDay: new Date(year, month, 0).getDay(),
      weeks: []
    };
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    // 循环上个月末尾几天添加到数组
    for (let i = dates.firstDay; i > 0; i--) {
      dates.lastMonthDays.push({
        'date': new Date(year, month, -i).getDate() + '',
        'month': month - 1
      })
    }
    // 循环本月天数添加到数组
    for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
      let have = false;
      for (let j = 0; j < selected.length; j++) {
        let selDate = selected[j].date.split('-');
        if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(i) === Number(selDate[2])) {
          have = true;
        }
      }
      dates.currentMonthDys.push({
        'date': i + "",
        'month': month,
        'status': stastus[i - 1],
        'code': staCode[i - 1],
        'applyCode': applyArr[i - 1],
        'beg': begArr[i - 1],
        'end': endArr[i - 1],
        'workDate': workDate[i - 1],
        'begModel': begM[i - 1],
        'endModel': endM[i - 1],
        have
      })
    }
    // 循环下个月开始几天 添加到数组
    for (let i = 1; i < 7 - dates.endDay; i++) {
      dates.nextMonthDays.push({
        'date': i + '',
        'month': month + 1
      })
    }
    canlender = canlender.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
    // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
    for (let i = 0; i < canlender.length; i++) {
      if (i % 7 == 0) {
        dates.weeks[parseInt(i / 7)] = new Array(7);
      }
      dates.weeks[parseInt(i / 7)][i % 7] = canlender[i]
    }
    // 渲染数据
    this.setData({
      selectDay: month + "月" + date + "日",
      "canlender.weeks": dates.weeks,
      'canlender.month': month,
      'canlender.date': date,
      "canlender.day": day,
      'canlender.year': year,
    });
  },
  /**
   * 时间计算
   */
  getDate(date, AddDayCount, str = 'day') {
    if (typeof date !== 'object') {
      date = date.replace(/-/g, "/")
    }
    let dd = new Date(date)
    switch (str) {
      case 'day':
        dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
        break;
      case 'month':
        dd.setMonth(dd.getMonth() + AddDayCount)// 获取AddDayCount天后的日期
        break;
      case 'year':
        dd.setFullYear(dd.getFullYear() + AddDayCount)// 获取AddDayCount天后的日期
        break;
    }
    let y = dd.getFullYear()
    let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
    return y + '-' + m
  },
  //request异常考勤数据
  requestData: function (month) {
    let userInfo = wx.getStorageSync("userInfo");
    let that = this;
    let url = head.header + requestUrl;
    wx.request({
      url: url,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: month,
        userId: that.data.userId,
        token: userInfo.token,
        openId: userInfo.openId
      },
      success: function (res) {
        let selectArr = [];
        let statuStrArr = [];
        let statuArr = [];
        let applyCode = [];
        let begTime = [];
        let endTime = [];
        let workDate = [];
        let begModel = [];
        let endModel = [];
        let Arr = res.data;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].atendStatus != "0") {
            selectArr.push({ date: res.data[i].workDateStr })
          }
          statuStrArr.push(res.data[i].atendStatuStr);
          statuArr.push(res.data[i].atendStatus);
          applyCode.push(res.data[i].applyStatus);
          begTime.push(res.data[i].begTime);
          endTime.push(res.data[i].endTime);
          workDate.push(res.data[i].workDateStr);
          begModel.push(res.data[i].begModel);
          endModel.push(res.data[i].endModel);
        }
        that.setData({
          selected: selectArr
        });
        that.getWeek(month, statuStrArr, statuArr, applyCode, begTime, endTime, workDate, begModel, endModel);
      }
    })
  }
})