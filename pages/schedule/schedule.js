Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowMonth: '',
    nowDay: '',
    list: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToday()
  },
  getToday() {
    let today = new Date
    let nowMonth = today.getMonth() + 1
    let nowday = today.getDate()
    this.setData({
      nowMonth: nowMonth,
      nowDay: nowday
    })
  },
  monthClick(e) {
    // console.log(e.detail);
    this.setData({
      nowMonth: e.detail
    })
  },
  todayClick(e) {
    // console.log(e.datail);
    this.setData({
      nowDay: e.detail
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})