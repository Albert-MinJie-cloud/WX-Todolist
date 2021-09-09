// pages/useraccenter/useraccenter.js
Page({
  data: {
    userInfo: '',
    userLogin: './image/manBlue.png',
    userUnLogin: './image/userUnlogin.png'
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  toAbout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },

  getUserInfo() {
    console.log('获取用户信息');
    var value = wx.getStorageSync('token')
    const _this = this
    console.log(value);
    wx.request({
      url: 'https://www.it266.com/api/customer/whoami',
      method: 'get',
      data: {
        token: value
      },
      success(res) {
        console.log(res);
        if (!res.data.status) {
        } else {
          _this.setData({
            userInfo: res.data.data
          })
        }
      }
    })
  },

  exitLogin() {
    wx.showModal({
      title: '提示',
      content: '是否确定退出登录',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.reLaunch({
            url: '../useraccenter/useraccenter',
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  onLoad: function (options) {
    this.getUserInfo()
  },
})