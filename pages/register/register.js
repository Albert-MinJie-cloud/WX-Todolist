Page({
  data: {
    time: 60000,
    timeDate: {},
    phone: '',
    phoneError: '',
    phoneStatus: false,
    nickname: '',
    nicknameError: '',
    nicknameStatus: false,
    code: '',
    codeError: '',
    codeStatus: false,
    codeDisable: true,
    password: '',
    passwordError: '',
    passwordStatus: false,
    passwordDisplay: false,
    passwordType: 'password',
    passwordIcon: 'closed-eye',
    codeDialog: false,
    captcha_key: '',
    codePicUrl: '',
    picCode: '',
    countDownStatus: false,
    verification_key: '',
    token: ''
  },

  /* 倒计时启动，暂停，重置，结束 */
  start() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.start();
  },
  pause() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.pause();
  },
  reset() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.reset();
  },
  finished() {
    Toast('倒计时结束');
  },

  /* 更换密码提图标 */
  changePasswordIcon() {
    this.setData({
      passwordDisplay: !this.data.passwordDisplay,
      passwordIcon: !this.data.passwordDisplay ? 'eye-o' : 'closed-eye',
      passwordType: !this.data.passwordDisplay ? 'text' : 'password'
    })
  },

  /* 先验证手机格式是否正确，正确再获取图片验证码*/
  getCode() {
    let ph = this.data.phone
    let rpx = /^1[0-9]{10}/g
    if (!rpx.test(ph)) {
      this.setData({
        phoneError: '手机号格式不正确'
      })
    } else {
      this.setData({
        phoneError: ''
      })
      this.getPicCode()
    }
  },

  /* 获取图片验证码 */
  getPicCode() {
    console.log("获取图片验证码");
    const _this = this
    wx.request({
      url: 'https://www.it266.com/api/image/captcha',
      method: 'post',
      success(res) {
        if (!res.data.status) {
          console.log(res.data.status)
        } else {
          _this.setData({
            codeDialog: true,
            picCode: '',
            captcha_key: res.data.data.captcha_key,
            codePicUrl: res.data.data.url
          })
        }
      }
    })
  },

  /* 图片验证码的确定按键 */
  codeConfirm() {
    const _this = this
    wx.request({
      url: 'https://www.it266.com/api/sms/verification',
      method: 'post',
      data: {
        mobile: _this.data.phone,
        captcha_key: _this.data.captcha_key,
        captcha_code: _this.data.picCode,
        access_key: '4554879b8451db2ba888226bdfe483b4'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (!res.data.status) {
          wx.showToast({
            title: res.data.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          _this.setData({
            countDownStatus: true,
            codeDisable: false,
            verification_key: res.data.data.verification_key
          })
        }
      }
    })
  },

  timeChange(e) {
    this.setData({
      timeDate: e.detail
    })
  },

  timeOver() {
    this.setData({
      countDownStatus: false
    })
  },

  loginRequest() {
    if (this.data.phoneStatus && this.data.codeStatus && this.data.passwordStatus) {
      const _this = this
      wx.request({
        url: 'https://www.it266.com/api/customer/create',
        method: 'post',
        data: {
          mobile: _this.data.phone,
          password: _this.data.password,
          nickname: _this.data.nickname,
          verification_key: _this.data.verification_key,
          verification_code: _this.data.code,
          access_key: '4554879b8451db2ba888226bdfe483b4'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (!res.data.status) {
            wx.showToast({
              title: res.data.data.message,
              icon: 'none',
              duration: 2000
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
        title: '手机号、昵称、验证码、密码均不能为空',
        icon: 'none',
        duration: 1500
      })
    }
  },

  phoneChange(e) {
    if (e.detail === '') {
      this.setData({
        phoneError: '',
        phoneStatus: false
      })
    } else {
      let rpx = /^1[0-9]{10}/g
      if (!rpx.test(e.detail)) {
        this.setData({
          phoneError: '手机号格式不正确',
          phoneStatus: false
        })
      } else {
        this.setData({
          phoneError: '',
          phoneStatus: true
        })
      }
    }
  },

  nicknameChange(e) {
    if (e.detail === '') {
      this.setData({
        nicknameError: '昵称不能为空',
        nicknameStatus: false
      })
    } else {
      this.setData({
        nicknameError: '',
        nicknameStatus: true
      })
    }
  },

  codeChange(e) {
    if (e.detail === '') {
      this.setData({
        codeError: '',
        codeStatus: false
      })
    } else {
      let codeRxg = /[0-9]{4}/g
      if (!codeRxg.test(e.detail)) {
        this.setData({
          codeError: '验证码为4位纯数字',
          codeStatus: false
        })
      } else {
        this.setData({
          codeError: '',
          codeStatus: 'true'
        })
      }
    }
  },

  passwordChange(e) {
    if (e.detail === '') {
      this.setData({
        passwordError: '',
        passwordStatus: false
      })
    } else {
      let passwordRxg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,16}$/g
      if (!passwordRxg.test(e.detail)) {
        this.setData({
          passwordError: '密码长度为6~16位，必须包含大小写字母',
          passwordStatus: false
        })
      } else {
        this.setData({
          passwordError: '',
          passwordStatus: true
        })
      }
    }
  },

  onLoad: function (options) {

  },
})