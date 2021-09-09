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
    let selectTimeStr = year + "-" + month + "-" + day + " " + hour + ":" + min
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

  /* 点击新增发起微信请求，提交新增请求 */
  addTodoRequest() {
    if (this.data.title === '' || this.data.selectDate === '' || this.data.repeat === '') {
      wx.showToast({
        title: '输入内容不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      var value = wx.getStorageSync('token')
      const _this = this
      console.log(_this.data.title, _this.data.repeat, _this.data.selectDate);
      wx.request({
        url: 'https://www.it266.com/app/todo/create',
        method: 'post',
        data: {
          name: _this.data.title,
          remind_at: _this.data.selectDate + ':' + '00',
          repeat: _this.data.repeat,
          token: value
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(res.data.status)
          if (!res.data.status) {
            if (res.data.data.includes('token')) {
              wx.showModal({
                title: '提示',
                content: '未登录，点击确定跳到登录页',
                success(res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../login/login',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          } else {
            wx.reLaunch({
              url: '../index/index',
            })
          }
        }
      })
    }
  },

  onLoad: function (options) {

  },
})