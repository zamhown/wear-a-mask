<template>
  <div id="export">
    <p class="img-container" ref="ic"><img :src="imgUrl" :style="imgStyle"></p>
    <p class="title">长按或右键保存图片</p>
    <p class="control">
      <button @click="backToEditor">继续编辑</button>
      <button @click="backToIndex">重选图片</button>
    </p>
  </div>
</template>

<script>
/* eslint-disable no-console, no-unused-vars */
import { mapState } from 'vuex';

export default {
  data() {
    return {
      imgStyle: {}
    }
  },
  computed: {
    ...mapState({
      imgUrl: state => state.exportData.url
    })
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
    if (!this.$store.state.exportData) {
      this.$emit('navTo', 'index');
    }
  },
  mounted () {
    const cw = this.$refs.ic.clientWidth;
    const ch = this.$refs.ic.clientHeight;
    const iw = this.$store.state.exportData.width;
    const ih = this.$store.state.exportData.height;
    if (cw / ch < iw / ih) {
      this.imgStyle = {
        width: '100%'
      }
    } else {
      this.imgStyle = {
        height: '100%'
      }
    }
  }
}
</script>

<style scoped>
#export {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.title {
  position: absolute;
  width: 100%;
  height: 30px;
  top: 0px;
  background: #ff664d;
  color: white;
  line-height: 30px;
}
.img-container {
  height: 100%;
}
img {
  display: block;
  margin: 0px auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.control {
  position: absolute;
  width: 100%;
  height: 60px;
  bottom: 0px;
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
  box-shadow: 0px 0px 10px #ccc;
}
button:hover {
  background: #ff664d;
}
</style>
