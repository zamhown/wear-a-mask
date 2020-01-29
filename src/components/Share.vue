<template>
  <div id="share">
    <div id="shareUI" :class="{'loading': loading}">
      <p class="img-container" ref="ic"><img :src="imgUrl" :style="imgStyle" @load="onImgLoaded"></p>
      <div class="title" ref="title">
        <p>保存下方图片，分享给朋友吧！</p>
      </div>
      <div class="control" ref="control">
        <button @click="back">返回</button>
      </div>
    </div>
    <div v-if="loading" id="loading">
      <div>
        <p>
          <b>正在生成中……</b>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import util from '../utils/util';

export default {
  data() {
    return {
      imgUrl: '',
      imgStyle: {},
      loading: true
    }
  },
  methods: {
    onImgLoaded () {
      if (this.imgUrl) {
        this.loading = false;
      }
    },
    back () {
      this.$emit('navTo', 'export');
    }
  },
  created () {
    if (!this.$store.state.finishImg) {
      this.$emit('navTo', 'index');
    }
  },
  mounted () {
    setTimeout(() => {
      const self = this;
      const img = new Image();
      img.src = this.$store.state.finishImg;
      img.onload = function () {
        util.getShareImageSrc(sUrl => {
          const simg = new Image();
          simg.src = sUrl;
          simg.onload = function () {
            const {imgWidth, imgHeight, imgX, imgY} =
              util.imgContain(self.$refs.ic.clientWidth,
              self.$refs.ic.clientHeight - self.$refs.title.clientHeight - self.$refs.control.clientHeight,
              simg.width, simg.height);
            self.imgStyle = {
              width: imgWidth + 'px',
              height: imgHeight + 'px',
              left: imgX + 'px',
              top: (imgY + self.$refs.title.clientHeight) + 'px'
            }

            const canvas = document.createElement('canvas');
            canvas.width = simg.width;
            canvas.height = simg.height;
            const context = canvas.getContext('2d');
            context.drawImage(simg, 0, 0, simg.width, simg.height,
              0, 0, canvas.width, canvas.height);
            const [x0, y0] = [157, 272];  // 插图区域左上角点
            const [x1, y1] = [610, 679];  // 插图区域右下角点
            const rect = util.imgCover(x1 - x0, y1 - y0, img.width, img.height);
            const [xBlank, yBlank] = [-rect.imgX / rect.rate, -rect.imgY / rect.rate];
            context.drawImage(img, xBlank, yBlank,
              img.width - xBlank * 2, img.height - yBlank * 2,
              x0, y0, rect.imgWidth + rect.imgX * 2, rect.imgHeight + rect.imgY * 2);
            self.imgUrl = canvas.toDataURL("image/png");
          }
        });
      }
    }, 300);  // 留时间刷新界面
  }
}
</script>

<style scoped>
#share, #shareUI {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title {
  position: absolute;
  width: 100%;
  height: 30px;
  top: 0px;
  background: #ff664d;
}
.title p {
  color: white;
  line-height: 30px;
}
.img-container {
  height: 100%;
  position: relative;
}
img {
  display: block;
  position: absolute;
  box-shadow: 0px 0px 7px #ccc;
}
.control {
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0;
}
button {
  width: 120px;
  height: 40px;
  margin: 10px;
  background: #ff8571;
  color: white;
  border-radius: 20px;
  appearance: none;
  border: none;
  font-size: 16px;
  box-shadow: 0px 0px 5px #888;
}
button:hover {
  background: #ff664d;
}
#shareBtn {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 95px;
  height: 25px;
  margin: 10px;
  background: white;
  border-radius: 13px;
  appearance: none;
  border: none;
  font-size: 14px;
  box-shadow: 0px 0px 5px #ccc;
  opacity: 0.6;
}
#shareUI.loading {
  filter: blur(20px);
}
#loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
}
#loading > div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 50px;
  padding: 10px;
  margin: -25px 0px 0px -100px;
  background: white;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>
