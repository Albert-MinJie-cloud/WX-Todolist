Page({
  data: {
    titleInput: "border-radius: 20rpx ; background:#f6f6f6;",
    title: '',
    selectDate: '',
    repeat: '',
    repeatText: '',
    datePickerDisplay: false,
    minData: new Date().getTime(),
    currentDate: new Date().getTime(),
    repeatPickerDisplay: false,
    repeatColumns: [
      { text: '不重复', value: 0 },
      { text: '每天', value: 1 },
      { text: '每周', value: 2 },
      { text: '每月', value: 3 },
      { text: '每季度', value: 4 },
      { text: '每年', value: 5 }
    ],
    id: '',
    status: ''
  },

  /* 关闭时间选择器的弹出 */
  datePickerClose() {
    this.setData({
      datePickerDisplay: false
    })
  },

  /* 打开时间选择器的弹出 */
  datePickerOpen() {
    this.setData({
      datePickerDisplay: true
    })
  },

  /* 输入框的文本信息 */
  inputTitle(event) {
    this.setData({
      title: event.detail
    })
  },

  /* 时间选择器的选择时间 */
  selectTime(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  /* 点击时间选择器的确认 */
  confirmTime() {
    console.log(this.data.currentDate);
    let selectTime = new Date(this.data.currentDate)
    let year = selectTime.getFullYear()
    let month = selectTime.getMonth() + 1
    let day = selectTime.getDate()
    let hour = selectTime.getHours()
    let min = selectTime.getMinutes()
    let selectTimeStr = year + "-" + month + "-" + day + " " + hour + ":" + min + ':' + '00'
    this.setData({
      selectDate: selectTimeStr,
      datePickerDisplay: false
    })
  },

  /* 重复频率选择器打开 */
  repeatPickerOpen() {
    this.setData({
      repeatPickerDisplay: true
    })
  },

  /* 重复频率选择器关闭 */
  repeatPickerClose() {
    this.setData({
      repeatPickerDisplay: false
    })
  },

  /* 选择重复频率选择器 */
  selectRepeat(event) {
    this.setData({
      repeat: event.detail.index,
    })
  },

  /* 选择确定的的频率重复器 */
  confirmRepeat() {
    // console.log(this.data.repeatColumns[this.data.repeat].text);
    this.setData({
      repeatText: this.data.repeatColumns[this.data.repeat].text,
      repeatPickerDisplay: false
    })
  },

  /* 获取todo的详情 */
  getTodoDetail() {
    var token = wx.getStorageSync('token')
    const _this = this
    wx.request({
      url: 'https://www.it266.com/app/todo/detail',
      method: 'GET',
      data: {
        id: _this.data.id,
        token: token
      },
      success(res) {
        if (!res.data.status) {

        } else {
          switch (res.data.data.repeat) {
            case 0:
              _this.setData({
                title: res.data.data.name,
                selectDate: res.data.data.remind_at,
                repeat: res.data.data.repeat,
                repeatText: "不重复"
              })
            case 1:
              _this.setData({
                title: res.data.data.name,
                selectDate: res.data.data.remind_at,
                repeat: res.data.data.repeat,
                repeatText: "每天"
              })
            case 2:
              _this.setData({
                title: res.data.data.name,
                selectDate: res.data.data.remind_at,
                repeat: res.data.data.repeat,
                repeatText: "每周"
              })
            case 3:
              _this.setData({
                title: res.data.data.name,
                selectDate: res.data.data.remind_at,
                repeat: res.data.data.repeat,
                repeatText: "每月"
              })
            case 4:
              _this.setData({
                title: res.data.data.name,
                selectDate: res.data.data.remind_at,
                repeat: res.data.data.repeat,
                repeatText: "每季度"
              })
            case 5:
              _this.setData({
                title: res.data.data.name,
                selectDate: res.data.data.remind_at,
                repeat: res.data.data.repeat,
                repeatText: "每年"
              })
          }
        }
      }
    })
  },

  /* 更新todo的事件 */
  updateTodo() {
    console.log(this.data);
    var token = wx.getStorageSync('token')
    const _this = this
    wx.request({
      url: 'https://www.it266.com//app/todo/update',
      method: 'POST',
      data: {
        id: _this.data.id,
        token: token,
        name: _this.data.title,
        remind_at: _this.data.selectDate,
        repeat: _this.data.repeat
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (!res.data.status) {
          if (res.data.data.includes('token')) {
            wx.reLaunch({
              url: '../login/login',
            })
          } else {
            wx.showToast({
              title: res.data.data,
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          wx.showToast({
            title: "更新成功",
            icon: 'none',
            duration: 1500
          }),
            wx.reLaunch({
              url: '../index/index',
            })
        }
      }
    })
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      status: options.status
    })
    this.getTodoDetail()
  },
})