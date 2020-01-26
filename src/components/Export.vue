<template>
  <div id="export">
    <p class="title">长按或右键保存图片</p>
    <p class="img-container"><img :src="imgUrl"></p>
    <p class="control">
      <button @click="backToEditor">继续编辑</button>
      <button @click="backToIndex">重选图片</button>
    </p>
  </div>
</template>

<script>
/* eslint-disable no-console, no-unused-vars */

export default {
  data() {
    return {
      imgUrl: this.$store.state.exportData.url,
      imgWidth: 0,
      imgHeight: 0,
      imgX: 0,
      imgY: 0,
      imgStyle: null
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
    if (!this.$store.state.exportData) {
      this.$emit('navTo', 'index');
    }
  }
}
</script>

<style scoped>
#export {
  position: relative;
  height: 100%;
  display: flex; 
  flex-flow: column; 
}
.title {
  height: 30px;
  background: #ff664d;
  color: white;
  line-height: 30px;
}
.img-container {
  flex: 1;
}
img {
  display: block;
  margin: 0px auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.control {
  height: 60px;
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
