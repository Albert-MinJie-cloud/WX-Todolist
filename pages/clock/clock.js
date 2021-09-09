Page({
  data: {
    active: 0,
    hourDeg: '',
    minDeg: '',
    dayDeg: '',
    hour: '',
    min: '',
    second: '',
    image:'/tabbarImage/clock.png'
  },
  onLoad() {
    const deg = 6;
    setInterval(() => {
      let day = new Date();
      let hh = day.getHours() * 30;
      let mm = day.getMinutes() * deg;
      let ss = day.getSeconds() * deg;
      this.setData({
        hourDeg: `transform:rotateZ(${hh + mm / 12}deg)`,
        minDeg: `transform:rotateZ(${mm}deg)`,
        dayDeg: `transform:rotateZ(${ss}deg)`,
        hour: day.getHours(),
        min: day.getMinutes(),
        second: day.getSeconds()
      })
    }, 1000);

    var that = this;
    let base64 = wx.getFileSystemManager().readFileSync(this.data.image, 'base64');
    that.setData({
      image: 'data:image/jpg;base64,' + base64
    });
  }

})