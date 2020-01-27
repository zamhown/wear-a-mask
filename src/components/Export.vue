<template>
  <div id="export">
    <div id="exportUI" :class="{'loading': loading}">
      <p class="img-container" ref="ic"><img :src="imgUrl" :style="imgStyle" :load="loading=false"></p>
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

export default {
  data() {
    return {
      imgUrl: '',
      imgStyle: {},
      loading: true
    }
  },
  methods: {
    backToIndex () {
      this.$emit('navTo', 'index');
    },
    backToEditor () {
      this.$emit('navTo', 'editor');
    }
  },
  created () {
    if (!this.$store.state.editor) {
      this.$emit('navTo', 'index');
    }
  },
  mounted () {
    const cw = this.$refs.ic.clientWidth;
    const ch = this.$refs.ic.clientHeight - this.$refs.title.clientHeight;
    const iw = this.$store.state.editor.layers[0].image.width;
    const ih = this.$store.state.editor.layers[0].image.height;
    const xRate = cw / iw;
    const yRate = ch / ih;
    const setRate = xRate < yRate ? xRate : yRate;
    const imgWidth = iw * setRate;
    const imgHeight = ih * setRate;
    const imgX = (cw - imgWidth) / 2;
    const imgY = (ch - imgHeight) / 2 + this.$refs.title.clientHeight;
    this.imgStyle = {
      width: imgWidth + 'px',
      height: imgHeight + 'px',
      left: imgX + 'px',
      top: imgY + 'px'
    }
    this.imgUrl = this.$store.state.editor.export()
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
  background: #ffbbb4;
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
