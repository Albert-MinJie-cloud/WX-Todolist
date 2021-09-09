// components/dkCalendar/dk-calendar.js
//为兼容ios，组件内日期全部改为/连接  by：xiaokar
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    originActiveData: {
      type: Array,
      value: ''
    },
    //m为小号，不填默认大号
    size: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    week: ['日', '一', '二', '三', '四', '五', '六'],
    row1: [],
    row2: [],
    row3: [],
    currDay: 0,
    currDayDetail: '', //具体的哪年哪月哪日
    chooseYear: '',
    chooseMonth: '',
    currDayTag: 0, //大日历需要算上空白
    currYear: '',
    currMonth: '',
    activeData:[],
    isNext:true,
    isPre:true,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 顶部上下月点击
    preDate() {
      if(!this.data.isPre) return
      let month = this.data.chooseMonth
      let year = this.data.chooseYear
      month--
      if (month == 0) {
        year--
        month = 12
      }
      this.setData({
        chooseMonth: month,
        chooseYear: year
      })
      this.getInit()
    },
    nextDate() {
      if(!this.data.isNext) return
      let month = this.data.chooseMonth
      let year = this.data.chooseYear
      month++
      if (month > 12) {
        year++
        month = 1
      }
      this.setData({
        chooseMonth: month,
        chooseYear: year
      })
      this.getInit()
    },
    //检查日期
    checkedDate(){
      let year = this.data.chooseYear
      let month = this.data.chooseMonth
      let currYear = this.data.currYear
      let currMonth = this.data.currMonth
      //限制日期-上
      if(year==2021&&month==1){
        this.setData({isPre:false})
      }else{
        this.setData({isPre:true})
      }
      //限制日期-下
      if(year==currYear&&month==currMonth){
        this.setData({isNext:false})
      }else{
        this.setData({isNext:true})
      }
    },
    // 去打卡详情页
    goDateDK() {
      // wx.navigateTo({
      //   url: '../../pages/dateDetail/dateDetail',
      // })
      wx.showToast({
        title: '跳转其他页面',
      })
    },
    //获取本月天数-提供年月
    getCurrDayTotal(year, month) {
      var total = new Date(year, month, 0)
      return total.getDate()
    },
    // 初始化微打卡
    getInitSm() {
      // 当前天数
      const currDay = new Date().getDate()
      // 当前年
      const currYear = new Date().getFullYear()
      // 当前月数
      const currMonth = new Date().getMonth() + 1
      // 本月总天数
      const currDayTotal = this.getCurrDayTotal(currYear, currMonth)
      // 当前星期几
      const currWeek = new Date().getDay()
      // 行数据
      let row1Arr = []
      let row2Arr = []
      let dtodArr = []

      row1Arr.push(this.data.week[currWeek])
      row2Arr.push(currDay)
      dtodArr.push(`${currYear}/${currMonth<10?'0'+currMonth:currMonth}/${currDay<10?'0'+currDay:currDay}`)
      // 向前
      let createWeek = currWeek
      let createDay = currDay
      let createYear = currYear
      let createMonth = currMonth
      for (let i = 0; i < 3; i++) {
        createWeek--
        createDay--
        if (createWeek < 0) {
          createWeek = this.data.week.length - 1
        }
        if (createDay < 1) {
          createDay = currDayTotal
          //年月相关
          createMonth--
          if (createMonth == 0) {
            createMonth = 12
            createYear--
          }
        }
        row1Arr.unshift(this.data.week[createWeek])
        row2Arr.unshift(createDay)
        dtodArr.unshift(`${createYear}/${createMonth<10?'0'+createMonth:createMonth}/${createDay<10?'0'+createDay:createDay}`)
      }
      // 向后
      createWeek = currWeek
      createDay = currDay
      createYear = currYear
      createMonth = currMonth
      for (let i = 0; i < 3; i++) {
        createWeek++
        createDay++
        if (createWeek > 6) {
          createWeek = 0
        }
        if (createDay > currDayTotal) {
          createDay = 1
          //年月相关
          createMonth++
          if (createMonth == 13) {
            createMonth = 1
            createYear++
          }
        }
        row1Arr.push(this.data.week[createWeek])
        row2Arr.push(createDay)
        dtodArr.push(`${createYear}/${createMonth<10?'0'+createMonth:createMonth}/${createDay<10?'0'+createDay:createDay}`)
      }
      //完成天数数据row3对比
      let row3Arr = []
      let hasSame = false
      for (let i = 0; i < dtodArr.length; i++) {
        hasSame = false
        for (let j = 0; j < this.data.activeData.length; j++) {
          if (dtodArr[i] == this.data.activeData[j]) {
            hasSame = true
          }
        }
        if (hasSame)
          row3Arr[i] = true
        else
          row3Arr[i] = false
      }
      console.log(row3Arr)

      this.setData({
        'row1': row1Arr,
        'row2': row2Arr,
        'row3': row3Arr,
        'currDay': currDay
      })
      // console.log(this.data.activeData)

    },
    // 初始化默认打卡
    getInit() {
      // 选择的日历
      const chooseDate = `${this.data.chooseYear}/${this.data.chooseMonth}/01`
      // 当前月天数
      const currDay = new Date().getDate()
      // 选择年
      const chooseYear = new Date(chooseDate).getFullYear()
      // 选择月数
      const chooseMonth = new Date(chooseDate).getMonth() + 1
      // 选择月总天数
      const chooseDayTotal = this.getCurrDayTotal(chooseYear, chooseMonth)
      //选择月一号是星期几
      const chooseOneToWeek = new Date(`${this.data.chooseYear}/${this.data.chooseMonth}/01`).getDay()
      // 行数据
      let row1Arr = []
      let row2Arr = []
      let currDayTag = 0
      let dtodArr = []
      // 行一
      row1Arr = this.data.week
      // 行二
      // 向后补充天数
      for (let i = 1; i <= chooseDayTotal; i++) {
        row2Arr.push(i)
      }
      // 向前补充齐
      console.log('选择月的1号是星期', chooseOneToWeek)
      for (let i = 1; i < chooseOneToWeek + 1; i++) {
        row2Arr.unshift('')
      }
      currDayTag = currDay + chooseOneToWeek
      // 行三对比-打钩
      for (let i = 0; i < row2Arr.length; i++) {
        let hasSame = false
        if (!row2Arr[i]) {
          dtodArr.push(false)
          continue;
        }
        for (let j = 0; j < this.data.activeData.length; j++) {
          let newDate = `${this.data.chooseYear}/${this.data.chooseMonth<10?'0'+this.data.chooseMonth:this.data.chooseMonth}/${row2Arr[i]<10?'0'+row2Arr[i]:row2Arr[i]}`
          if (newDate == this.data.activeData[j]) {
            hasSame = true
          }
        }
        if (hasSame) {
          dtodArr.push(true)
        } else {
          dtodArr.push(false)
        }
      }
      // console.log(dtodArr)

      this.setData({
        row1: row1Arr,
        row2: row2Arr,
        currDayTag: currDayTag,
        row3: dtodArr
      })
      if (!this.data.currDay) {
        this.setData({
          currDay: currDay,
          currDayDetail: `${this.data.chooseYear}/${this.data.chooseMonth<10?'0'+this.data.chooseMonth:this.data.chooseMonth}/${currDay<10?'0'+currDay:currDay}`
        })
      }
      this.checkedDate()
      // console.log('当前',this.data.currYear,'选',this.data.chooseYear,this.data.currMonth,this.data.chooseMonth)
    },
    // 改变日期
    changeCurrDay(e) {
      // 基础过滤
      let day = e.currentTarget.dataset.day
      let isClick = !e.currentTarget.dataset.click
      console.log(day, isClick)
      if (!day) return
      //灰色过滤
      if (!isClick) return
      // 精确微型日历-向上退月
      if (this.data.size == 'm') {
        let today = new Date().getDate()
        if (day > today) {
          let month = this.data.chooseMonth - 1
          let year = this.data.chooseYear
          if (month == 0) {
            this.setData({
              chooseYear: year - 1,
              chooseMonth: 12
            })
          } else {
            this.setData({
              chooseMonth: month
            })
          }
        }
      }
      // console.log(e.currentTarget.dataset)
      //输出使用-，其余全用/
      let currDayDetail = `${this.data.chooseYear}/${this.data.chooseMonth<10?'0'+this.data.chooseMonth:this.data.chooseMonth}/${day<10?'0'+day:day}`
      let pushCurrDayDetail = `${this.data.chooseYear}-${this.data.chooseMonth<10?'0'+this.data.chooseMonth:this.data.chooseMonth}-${day<10?'0'+day:day}`
      this.triggerEvent('selectDate', {
        currDayDetail: pushCurrDayDetail
      })
      this.setData({
        currDay: day,
        currDayDetail: currDayDetail
      })

      // console.log(this.data.currDay,this.data.currDayDetail)
    },
    // 日期格式化v2
    getFormatDate(date) {
      date = new Date(date)
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return [year, month, day].map(formatNumber).join('/')
    },

  },
  lifetimes: {
    attached: function () {
      let that = this
      // 在组件实例进入页面节点树时执行
      this.data.originActiveData.map(currentValue => {that.data.activeData.push(that.getFormatDate(currentValue))})
      this.setData({activeData:this.data.activeData})
      console.log('选中日期:', this.data.activeData)
      //初始化当前年月
      this.setData({
        currYear: new Date().getFullYear(),
        chooseYear: new Date().getFullYear(),
        currMonth: new Date().getMonth() + 1,
        chooseMonth: new Date().getMonth() + 1
      })
      if (this.data.size == 'm')
        this.getInitSm()
      else
        this.getInit()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})