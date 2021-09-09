const app = getApp()

Page({
  data: {
    detailId: 456,
    option: [
      { text: '全部', value: 0 },
      { text: '未完成', value: 1 },
      { text: '已完成', value: 2 }
    ],
    value: 0,
    todoList: [],
    checked: true,
    selectSort: '正序',
    orderBy: 'asc'
  },

  /* 去新增页 */
  toAdd() {
    wx.navigateTo({
      url: '/pages/addtodo/addtodo',
    })
  },

  /* 去到详情页 */
  toDetail(e) {
    console.log(e.currentTarget.dataset);
    let detailid = e.currentTarget.dataset.id
    let detailstatus = e.currentTarget.dataset.status
    let url = '/pages/tododetail/tododetail?id=' + detailid + '&status=' + detailstatus
    const _this = this
    wx.navigateTo({
      url: url,
    })
  },

  /* 获取待办事项列表 */
  getTodoList() {
    const _this = this
    var token = wx.getStorageSync('token')
    if (token === '') {
      wx.showToast({
        title: '尚未登录',
        icon: 'none',
        duration: 2000,
        success() {
          setTimeout(() => {
            wx.navigateTo({
              url: '../login/login',
            })
          }, 1000)
        }
      })
    } else {
      wx.request({
        url: 'https://www.it266.com/app/todo',
        method: 'GET',
        data: {
          token: token,
          page: 1,
          status: _this.data.value,
          page_size: 20,
          sortby: 'id',
          order: _this.data.orderBy
        },
        success(res) {
          if (!res.data.status) {

          } else {
            console.log(res.data.data.data);
            _this.setData({
              todoList: res.data.data.data
            })
          }
        }
      })
    }
  },

  /* switch开关的变换 */
  switchChange(e) {
    console.log(e.detail);
    if (e.detail) {
      this.setData({
        checked: e.detail,
        selectSort: '正序',
        orderBy: 'asc'
      })
    } else {
      this.setData({
        checked: e.detail,
        selectSort: '倒序',
        orderBy: 'desc'
      })
    }
    this.getTodoList()
  },

  /* dropDown的选择 */
  dropDownChange(e) {
    console.log(e);
    this.getTodoList()
  },

  /* 刚进页面就加载 */
  onLoad() {
    this.getTodoList()
  },

  /* 点击完成的事件 */
  completeTodo(e) {
    console.log(e.currentTarget.dataset.id);
    var token = wx.getStorageSync('token')
    const _this = this
    wx.request({
      url: 'https://www.it266.com/app/todo/finish',
      method: 'POST',
      data: {
        token: token,
        id: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (!res.data.status) {
          wx.showToast({
            title: '完成待办失败',
            icon: 'none',
            duration: 1500
          })
        } else {
          _this.getTodoList()
        }
      }
    })
  },

  /* 点击删除的事件 */
  deleteTodo(e) {
    var token = wx.getStorageSync('token')
    const _this = this
    wx.request({
      url: 'https://www.it266.com/app/todo/delete',
      method: 'POST',
      data: {
        token: token,
        id: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (!res.data.status) {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 1500
          })
        } else {
          _this.getTodoList()
        }
      }
    })
  },

  /* 下拉刷新 */
  onPullDownRefresh() {
  //   const _this = this
  //   wx.showNavigationBarLoading()
  //   setTimeout(function () {
  //     wx.hideNavigationBarLoading({
  //       success() {
  //         var token = wx.getStorageSync('token')
  //         if (token === '') {
  //           wx.showToast({
  //             title: '尚未登录',
  //             icon: 'none',
  //             duration: 2000,
  //             success() {
  //               setTimeout(() => {
  //                 wx.navigateTo({
  //                   url: '../login/login',
  //                 })
  //               }, 1000)
  //             }
  //           })
  //         } else {
  //           _this.getTodoList()
  //         }
  //       }
  //     })
  //     wx.stopPullDownRefresh()
  //   }, 1500);
  }
})
