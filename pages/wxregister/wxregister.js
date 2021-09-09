Page({
  data: {
    phone: '',
    phoneError: '',
    phoneStatus: '',
    code: '',
    codeError: '',
    codeStatus: '',
    time: 60000,
    timeDate: {},
    countDownStatus: false,
    codeDisable: true,
    verification_key: '',
    temporary: '',
    codeDialog: false,
    codePicUrl: '',
    captcha_key: '',
    picCode: ''
  },

  phoneChange(e) {
    if (e.detail === '') {
      this.setData({
        phoneError: '手机号不能为空',
        phoneStatus: false
      })
    } else {
      let phoneRxg = /^1[0-9]{10}$/g
      if (!phoneRxg.test(e.detail)) {
        this.setData({
          phoneError: '手机号格式不正确',
          phoneStatus: false
        })
      } else {
        this.setData({
          phoneError: '',
          phoneStatus: true,
          codeDisable: false
        })
      }
    }
  },

  codeChange(e) {
    console.log(e.detail);
    if (e.detail === '') {
      this.setData({
        codeError: '验证码不能为空',
        codeStatus: false
      })
    } else {
      let codeRxg = /[0-9]{4}/
      if (!codeRxg.test(e.detail)) {
        this.setData({
          codeError: '验证码格式不正确',
          codeStatus: false
        })
      } else {
        this.setData({
          codeError: '',
          codeStatus: true
        })
      }
    }
  },

  timeChange(e) {
    console.log(e.detail);
    this.setData({
      timeDate: e.detail
    })
  },

  /* 获取图片验证码 */
  getPicCode() {
    console.log(this.data);
    if (this.data.phoneStatus) {
      const _this = this
      wx.request({
        url: 'https://www.it266.com/api/image/captcha',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (!res.data.status) {
            wx.showToast({
              title: '获取验证码失败',
              icon: 'none',
              duration: 1500
            })
          } else {
            console.log(res.data.data);
            _this.setData({
              captcha_key: res.data.data.captcha_key,
              codePicUrl: res.data.data.url,
              codeDialog: true,
              picCode: ''
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /* 获取短信验证码 */
  getCode() {
    console.log(this.data);
    const _this = this
    wx.request({
      url: 'https://www.it266.com/api/sms/verification',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        mobile: _this.data.phone,
        access_key: '4554879b8451db2ba888226bdfe483b4',
        captcha_key: _this.data.captcha_key,
        captcha_code: _this.data.picCode
      },
      success(res) {
        if (!res.data.status) {
          console.log(res.data);
        } else {
          console.log(res.data.data);
          _this.setData({
            verification_key: res.data.data.verification_key,
            countDownStatus: true
          })
        }
      }
    })
  },


  /* 时间结束 */
  timeOver() {
    this.setData({
      countDownStatus: false
    })
  },

  /* 注册按钮 */
  register() {
    console.log(this.data);
    if (this.data.phoneStatus && this.data.codeStatus) {
      console.log(this.data);
      const _this = this
      wx.request({
        url: 'https://www.it266.com/api/member/create/wxapp',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          access_key: '4554879b8451db2ba888226bdfe483b4',
          temporary: _this.data.temporary,
          mobile: _this.data.phone,
          verification_key: _this.data.verification_key,
          verification_code: _this.data.code
        },
        success(res) {
          if (!res.data.status) {
            wx.showToast({
              title: '登录失败，请检查你的验证码',
              icon: 'none',
              duration: 1000
            })
          } else {
            wx.setStorageSync('token', res.data.data.token)
            wx.reLaunch({
              url: '../index/index',
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '手机号或者验证码不能为空',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /* 获取到临时temporary */
  getWxTemporary() {
    const _this = this
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: 'https://www.it266.com/api/member/login/wxapp',
            method: 'POST',
            data: {
              code: res.code,
              access_key: '4554879b8451db2ba888226bdfe483b4'
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              if (!res.data.status) {

              } else {
                // console.log(res.data.data.temporary);
                _this.setData({
                  temporary: res.data.data.temporary
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  onLoad: function (options) {
    this.getWxTemporary()
  },
})