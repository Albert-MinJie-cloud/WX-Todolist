Page({
  data: {
    passwordDisplay: false,
    passwordIcon: "closed-eye",
    passwordType: "password",
    password: '',
    passwordError: '',
    passwordStatus: false,
    phone: '',
    phoneError: '',
    phoneStatus: false
  },

  toRegister() {
    wx.redirectTo({
      url: '../register/register',
    })
  },

  changePasswordIcon() {
    this.setData({
      passwordDisplay: !this.data.passwordDisplay,
      passwordIcon: !this.data.passwordDisplay ? 'eye-o' : 'closed-eye',
      passwordType: !this.data.passwordDisplay ? 'text' : 'password'
    })
  },

  phoneChange(e) {
    if (e.detail === '') {
      this.setData({
        phoneError: '',
        phoneStatus: false
      })
    } else {
      let passwordReg = /^1[0-9]{10}$/g
      if (!passwordReg.test(e.detail)) {
        this.setData({
          phoneError: '手机号格式不对',
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

  passwordChange(e) {
    if (e.detail === '') {
      this.setData({
        passwordError: '',
        passwordStatus: false
      })
    } else {
      let passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z]{6,16}$/g
      if (!passwordReg.test(e.detail)) {
        this.setData({
          passwordError: '密码长度为16为，且必须包含大小写',
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

  /* 登录按钮 */
  login() {
    if (this.data.passwordStatus && this.data.phoneStatus) {
      const _this = this
      wx.request({
        url: 'https://www.it266.com/api/customer/token',
        method: 'post',
        data: {
          mobile: _this.data.phone,
          password: _this.data.password,
          access_key: '4554879b8451db2ba888226bdfe483b4'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (!res.data.status) {
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 1500
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
        title: '手机号或者密码不正确',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /* 微信免密登录 */
  wxLogin() {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求获取临时凭证
          wx.request({
            url: 'https://www.it266.com/api/member/login/wxapp',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              access_key: '4554879b8451db2ba888226bdfe483b4',
              code: res.code
            },
            success(res) {
              console.log(res.data.status);
              if (!res.data.status) {

              } else {
                //拿到临时凭证去登陆，如果未于手机号绑定，则提示用户输入手机号绑定
                wx.request({
                  url: 'https://www.it266.com/api/member/token/wxapp',
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    access_key: '4554879b8451db2ba888226bdfe483b4',
                    temporary: res.data.data.temporary
                  },
                  success(res) {
                    if (!res.data.status) {
                      wx.showToast({
                        title: '账户第一次登录，需要注册关联账户',
                        icon: 'none',
                        duration: 2000,
                        success() {
                          setTimeout(() => {
                            wx.redirectTo({
                              url: '../wxregister/wxregister',
                            })
                          }, 2000)
                        }
                      })
                    } else {
                      wx.setStorageSync('token', res.data.data.token)
                      wx.reLaunch({
                        url: '../index/index',
                      })
                    }
                  }
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

  },
})