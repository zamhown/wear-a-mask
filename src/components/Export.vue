<template>
  <div id="export">
    <div id="exportUI" :class="{'loading': loading}">
      <p class="img-container" ref="ic"><img :src="imgUrl" :style="imgStyle" @load="onImgLoaded"></p>
      <button id="shareBtn" @click="share">分享</button>
      <div class="title" ref="title">
        <p>长按或右键保存下方图片</p>
        <div class="control">
          <button @click="backToEditor">继续编辑</button>
          <button @click="backToIndex">重选图片</button>
        </div>
      </div>
    </div>
    <div v-if="loading" id="loading">
      <div>
        <p>
          <b>正在导出中……</b>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState } from 'vuex';
import util from '../utils/util';

export default {
  data() {
    return {
      imgStyle: {},
      loading: true
    }
  },
  computed: mapState({
    imgUrl: 'finishImg'
  }),
  methods: {
    onImgLoaded () {
      if (this.imgUrl) {
        this.loading = false;
      }
    },
    backToIndex () {
      this.$emit('navTo', 'index');
    },
    backToEditor () {
      this.$emit('navTo', 'editor');
    },
    share () {
      this.$emit('navTo', 'share');
    }
  },
  created () {
    if (!this.$store.state.editor) {
      this.$emit('navTo', 'index');
    } else {
      this.$store.commit('setFinishImg', null);
    }
  },
  mounted () {
    const cw = this.$refs.ic.clientWidth;
    const ch = this.$refs.ic.clientHeight - this.$refs.title.clientHeight;
    const bg = this.$store.state.editor.layers[0];
    let iw = bg.image.width;
    let ih = bg.image.height;
    if (bg.orientation == 90 || bg.orientation == 270) {
      iw = bg.image.height;
      ih = bg.image.width;
    }
    const {imgWidth, imgHeight, imgX, imgY} = util.imgContain(cw, ch, iw, ih);
    this.imgStyle = {
      width: imgWidth + 'px',
      height: imgHeight + 'px',
      left: imgX + 'px',
      top: (imgY + this.$refs.title.clientHeight) + 'px'
    }
    setTimeout(() => {
      this.$store.commit('setFinishImg', this.$store.state.editor.export());
    }, 300);  // 留时间刷新界面
  }
}
</script>

<style scoped>
#export, #exportUI {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title {
  position: absolute;
  width: 100%;
  height: 90px;
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
}
.control {
  width: 100%;
  height: 60px;
  background: #ff9c92;
}
button {
  width: 120px;
  height: 40px;
  margin: 10px;
  background: white;
  border-radius: 20px;
  appearance: none;
  border: none;
  font-size: 16px;
  box-shadow: 0px 0px 5px #888;
}
button:hover {
  background: #f5dcd9;
}
#shareBtn {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 60px;
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
#exportUI.loading {
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
