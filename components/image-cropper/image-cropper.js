Component({
  properties: {
    // 裁剪框宽度，默认200px
    cropperWidth: {
      type: Number,
      value: wx.getWindowInfo().windowWidth,
    },
    CropType: { type: Number, value: 1 },
    imgUrl: {
      type: String,
      value: "",
    },
    maxscale: { type: Number, value: 3 },
  },

  data: {
    imageSrc: "", // 图片路径
    imageInfo: null, // 图片信息
    imageWidth: 0, // 图片宽度
    imageHeight: 0, // 图片高度
    imageLeft: 0, // 图片左边距
    imageTop: 0, // 图片上边距
    SLeft: 0, //
    STop: 0, //
    cropperLeft: 0, // 裁剪框左边距
    cropperTop: 0, // 裁剪框上边距
    cropperHeight: 0, // 裁剪框高度(根据宽度和2:3比例计算)
    scale: 1, // 缩放比例
    touch: {
      start: null,
      moved: false,
      startX: 0,
      startY: 0,
      startDistance: 0,
    },
    processing: false, // 是否正在处理中，防止重复操作
    SINGLEFINGER: false,
    DoubleFingers: false,
    OldScale: 1, //原始图片缩放比例
    CropframeTop: 0,
    CropframeLeft: 0,
    circularTouch: {
      start: null,
      moved: false,
      startX: 0,
      startY: 0,
      startDistance: 0,
    },
    circularWH: 150, //圆形头像宽高
  },

  lifetimes: {
    attached() {
      this.chooseImage();
      // 计算裁剪框高度;
      const cropperHeight =
        wx.getWindowInfo().windowHeight -
        (wx.getWindowInfo().windowWidth + 10) / 1.5;
      // 计算裁剪框位置，居中显示
      let cropperLeft =
        (wx.getWindowInfo().windowWidth - this.data.cropperWidth) / 2;
      let cropperTop = 0; // 可以根据需要调整
      if (this.data.CropType == 0) {
        this.setData({
          cropperLeft: 0,
          cropperTop,
        });
      }
      if (this.data.CropType == 1) {
        this.setData({
          CropframeLeft: (this.data.cropperWidth - 170) / 2,
          CropframeTop: 100,
        });
      }
      this.setData({
        cropperHeight,
      });
    },
  },

  methods: {
    // 选择图片
    chooseImage() {
      // tempFilePath
      wx.getImageInfo({
        src: this.data.imgUrl,
        success: (imageInfo) => {
          this.initImage(this.data.imgUrl, imageInfo);
        },
        complete: () => {
          this.setData({
            processing: false,
          });
        },
      });
      // if (this.data.processing) return;
      // this.setData({
      //   processing: true,
      // });
      // wx.chooseImage({
      //   count: 1,
      //   sizeType: ["original", "compressed"],
      //   sourceType: ["album", "camera"],
      //   success: (res) => {
      //     const tempFilePath = res.tempFilePaths[0];
      //     // 获取图片信息
      //   },
      //   fail: () => {
      //     this.setData({
      //       processing: false,
      //     });
      //   },
      // });
    },

    // 初始化图片
    initImage(src, imageInfo) {
      // 获取裁剪框的宽高
      const {
        cropperWidth,
        cropperHeight,
        cropperLeft,
        cropperTop,
      } = this.data;

      // 计算图片与裁剪框的比例
      const widthRatio = cropperWidth / imageInfo.width;
      const heightRatio = cropperHeight / imageInfo.height;

      // 选择较大的比例，确保图片至少填满裁剪框
      const baseRatio = Math.max(widthRatio, heightRatio);
      // 计算图片初始大小
      const imageWidth = imageInfo.width * baseRatio;
      const imageHeight = imageInfo.height * baseRatio;
      // 计算图片初始位置，使其居中对齐裁剪框
      const imageLeft = cropperLeft + (cropperWidth - imageWidth) / 2;
      const imageTop = cropperTop + (cropperHeight - imageHeight) / 2;

      this.setData({
        imageSrc: src,
        imageInfo,
        imageWidth,
        imageHeight,
        imageLeft,
        imageTop,
        scale: baseRatio,
        OldScale: baseRatio,
      });
    },

    // 触摸开始
    touchStart(e) {
      if (!this.data.imageSrc) return;
      const touch = e.touches;
      if (touch.length === 1) {
        // 单指触摸，记录开始位置
        this.setData({
          "touch.start": touch[0],
          "touch.moved": false,
          "touch.startX": this.data.imageLeft,
          "touch.startY": this.data.imageTop,
          SINGLEFINGER: true,
          DoubleFingers: false,
        });
      } else if (touch.length === 2) {
        // 双指触摸，记录两指间距离
        const xMove = touch[1].clientX - touch[0].clientX;
        const yMove = touch[1].clientY - touch[0].clientY;
        const distance = Math.sqrt(xMove * xMove + yMove * yMove);

        this.setData({
          "touch.startDistance": distance,
          SINGLEFINGER: false,
          DoubleFingers: true,
        });
      }
    },
    touchStartcircular(e) {
      const touch = e.touches;
      if (touch.length === 1) {
        // 单指触摸，记录开始位置
        this.setData({
          "circularTouch.start": touch[0],
          "circularTouch.moved": false,
          "circularTouch.startX": this.data.CropframeLeft,
          "circularTouch.startY": this.data.CropframeTop,
          SINGLEFINGER: false,
          DoubleFingers: false,
        });
      }
    },
    // 触摸移动
    touchMoveCircular(e) {
      const touch = e.touches;
      let { cropperWidth, cropperHeight } = this.data;
      // 单指移动，平移图片
      const { start, startX, startY } = this.data.circularTouch;
      const current = touch[0];
      if (start) {
        let diffX = current.clientX - start.clientX + startX;
        let diffY = current.clientY - start.clientY + startY;
        // 限制左右边界

        if (diffX < 0) {
          diffX = 0;
        } else if (diffX > cropperWidth - 150 - 20) {
          diffX = cropperWidth - 150 - 20;
        }

        // console.log(diffX);
        // // 限制上下边界
        if (diffY < 0) {
          diffY = 0;
        } else if (diffY > cropperHeight - 150) {
          diffY = cropperHeight - 150;
        }

        this.setData({
          CropframeLeft: diffX,
          CropframeTop: diffY,
          "touch.moved": true,
          DoubleFingers: false,
        });
      }
    },
    touchMove(e) {
      if (!this.data.imageSrc) return;
      const touch = e.touches;
      let {
        imageLeft,
        cropperTop,
        cropperLeft,
        imageWidth,
        cropperWidth,
        cropperHeight,
        imageHeight,
      } = this.data;
      if (touch.length === 1 && this.data.SINGLEFINGER) {
        // 单指移动，平移图片
        const { start, startX, startY } = this.data.touch;
        const current = touch[0];
        if (start) {
          let diffX = current.clientX - start.clientX + startX;
          let diffY = current.clientY - start.clientY + startY;
          // 限制左右边界
          if (diffX > 0) {
            diffX = 0;
          } else if (diffX + imageWidth < cropperLeft + cropperWidth) {
            diffX = cropperLeft + cropperWidth - imageWidth;
          }
          // // 限制上下边界
          if (diffY > cropperTop) {
            diffY = cropperTop;
          } else if (diffY + imageHeight < cropperTop + cropperHeight) {
            diffY = cropperTop + cropperHeight - imageHeight;
          }

          this.setData({
            imageLeft: diffX,
            imageTop: diffY,
            "touch.moved": true,
            DoubleFingers: false,
          });
        }
      }
      if (touch.length === 2 && this.data.DoubleFingers) {
        const xMove = touch[1].clientX - touch[0].clientX;
        const yMove = touch[1].clientY - touch[0].clientY;
        const distance = Math.sqrt(xMove * xMove + yMove * yMove);
        const { startDistance } = this.data.touch;
        // 缩放放大倍数
        let scale = this.data.scale * (distance / startDistance);
        // this.data.OldScale 初始倍数
        if (scale <= this.data.OldScale) {
          scale = this.data.OldScale;
        }
        if (scale > this.data.maxscale) {
          scale = this.data.maxscale;
        }
        // 计算图片新尺寸
        let newWidth = this.data.imageInfo.width * scale;
        let newHeight = this.data.imageInfo.height * scale;
        // 计算图片新位置，保持中心点不变
        let diffWidth = newWidth - this.data.imageWidth;
        let diffHeight = newHeight - this.data.imageHeight;
        let newLeft = this.data.imageLeft - diffWidth / 2;
        let newTop = this.data.imageTop - diffHeight / 2;
        if (newLeft > 0) {
          newLeft = 0;
        } else if (newLeft + newWidth < cropperLeft + cropperWidth) {
          newLeft = cropperLeft + cropperWidth - newWidth;
        }
        if (newTop > cropperTop) {
          newTop = 0;
        } else if (newTop + newHeight < cropperTop + cropperHeight) {
          newTop = cropperTop + cropperHeight - newHeight;
        }
        this.setData({
          imageWidth: newWidth,
          imageHeight: newHeight,
          imageLeft: newLeft,
          imageTop: newTop,
          scale,
          "touch.startDistance": distance,
          "touch.moved": true,
          SINGLEFINGER: false,
        });
      }
    },

    // 触摸结束
    touchEnd() {
      // 可以在这里添加一些限制，比如不允许图片移出裁剪框太多
      // this.limitBoundary();
      this.setData({
        SINGLEFINGER: false,
        DoubleFingers: false,
      });
    },

    // 限制图片边界
    limitBoundary() {
      const {
        cropperWidth,
        cropperHeight,
        cropperLeft,
        cropperTop,
        imageWidth,
        imageHeight,
        imageLeft,
        imageTop,
      } = this.data;

      // 确保图片不会太小
      if (imageWidth < cropperWidth || imageHeight < cropperHeight) {
        // 重新初始化图片
        // this.initImage(this.data.imageSrc, this.data.imageInfo);
        return;
      }

      // 限制左右边界
      // if (diffX > 0) {
      //   diffX = 0;
      // } else if (diffX + imageWidth < cropperLeft + cropperWidth) {
      //   diffX = cropperLeft + cropperWidth - imageWidth;
      // }
      // // 限制上下边界
      // if (imageTop > cropperTop) {
      //   newTop = cropperTop;
      // } else if (imageTop + imageHeight < cropperTop + cropperHeight) {
      //   newTop = cropperTop + cropperHeight - imageHeight;
      // }

      // if (newLeft !== imageLeft || newTop !== imageTop) {
      //   this.setData({
      //     // imageLeft: newLeft,
      //     // imageTop: newTop,
      //   });
      // }
    },
    // 取消
    cancel() {
      this.triggerEvent("cropped", {
        type: "close",
      });
    },
    // 裁剪图片
    cropImage() {
      if (!this.data.imageSrc || this.data.processing) return;
      this.setData({
        processing: true,
      });

      // 获取画布上下文
      const cropperData = this.data;
      const ctx = wx.createCanvasContext("cropperCanvas", this);
      // 计算裁剪参数
      const scaleRatio = cropperData.imageInfo.width / cropperData.imageWidth;
      if (this.data.CropType == 1) {
        const srcX =
          (cropperData.CropframeLeft - cropperData.imageLeft) * scaleRatio;
        const srcY =
          (cropperData.CropframeTop - cropperData.imageTop) * scaleRatio;
        const srcWidth = cropperData.circularWH * scaleRatio;
        const srcHeight = cropperData.circularWH * scaleRatio;
        ctx.drawImage(
          cropperData.imageSrc,
          srcX,
          srcY,
          srcWidth,
          srcHeight,
          0,
          0,
          cropperData.circularWH,
          cropperData.circularWH
        );
        ctx.draw(false, () => {
          // 导出画布为图片
          wx.canvasToTempFilePath(
            {
              canvasId: "cropperCanvas",
              x: 0,
              y: 0,
              width: cropperData.circularWH,
              height: cropperData.circularWH,
              destWidth: (srcWidth * 750) / wx.getSystemInfoSync().windowWidth, // 保持原图分辨率
              destHeight:
                (srcHeight * 750) / wx.getSystemInfoSync().windowWidth,
              fileType: "png",
              quality: 1, //图片质量
              success: (res) => {
                // 返回裁剪后的图片路径
                this.setData({
                  path: res.tempFilePath,
                  width: srcWidth,
                  height: srcHeight,
                });
                this.triggerEvent("cropped", {
                  path: res.tempFilePath,
                  width: srcWidth,
                  height: srcHeight,
                  type: "complete",
                  circular: this.data.CropType,
                });
              },
              complete: () => {
                this.setData({
                  processing: false,
                });
              },
            },
            this
          );
        });
        return;
      }
      const srcX =
        (cropperData.cropperLeft - cropperData.imageLeft) * scaleRatio;
      const srcY = (cropperData.cropperTop - cropperData.imageTop) * scaleRatio;
      const srcWidth = cropperData.cropperWidth * scaleRatio;
      const srcHeight = cropperData.cropperHeight * scaleRatio;

      // 在父页面中创建一个临时的canvas
      // 绘制裁剪后的图片到画布
      ctx.drawImage(
        cropperData.imageSrc,
        srcX,
        srcY,
        srcWidth,
        srcHeight,
        0,
        0,
        cropperData.cropperWidth,
        cropperData.cropperHeight
      );
      ctx.draw(false, () => {
        // 导出画布为图片
        wx.canvasToTempFilePath(
          {
            canvasId: "cropperCanvas",
            x: 0,
            y: 0,
            width: cropperData.cropperWidth,
            height: cropperData.cropperHeight,
            destWidth: (srcWidth * 750) / wx.getSystemInfoSync().windowWidth, // 保持原图分辨率
            destHeight: (srcHeight * 750) / wx.getSystemInfoSync().windowWidth,
            fileType: "png",
            quality: 1, //图片质量
            success: (res) => {
              // 返回裁剪后的图片路径
              this.setData({
                path: res.tempFilePath,
                width: srcWidth,
                height: srcHeight,
              });
              this.triggerEvent("cropped", {
                path: res.tempFilePath,
                width: srcWidth,
                height: srcHeight,
                type: "complete",
                circular: this.data.CropType,
              });
            },
            complete: () => {
              this.setData({
                processing: false,
              });
            },
          },
          this
        );
      });
    },
  },
});
