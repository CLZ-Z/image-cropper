Page({
  /**
   * 页面的初始数据
   */
  data: {
    CropType: 1,
    Bimgs: [],
    cjtp: true,
    imgUrl: "/img/logo.jpg",
    scale: 5,
  },

  cropped(e) {
    if (e.detail.type == "close") {
      this.setData({
        Bimgs: [],
        cjtp: false,
        circular: 1,
      });
      wx.removeStorage({
        key: "Aimgs",
      });
      return;
    }
    let { circular, path } = e.detail;
    let imgs = this.data.Bimgs;
    if (1 == circular) {
      imgs.push(path);
      this.setData({
        CropType: 0,
      });
    }
    if (0 == circular) {
      imgs.push(path);
      this.setData({
        cjtp: false,
      });
      wx.navigateTo({
        url: "../confirm/confirm",
      });
      wx.setStorageSync("Aimgs", imgs);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
