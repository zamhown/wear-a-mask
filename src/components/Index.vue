<template>
  <div ref="index">
    <p><img class="example" src="../assets/example.png"></p>
    <p class="title" :style="{letterSpacing: $t('index.title.letterSpacing')}">{{ $t('index.title.text') }}</p>
    <p class="slogan" :style="{letterSpacing: $t('index.slogan.letterSpacing')}">
      <span v-if="!wide" v-html="$t('index.slogan.space')"></span>
      <span>{{ $t('index.slogan.text1') }}</span>
      <br v-if="!wide">
      <span v-if="!wide" v-html="$t('index.slogan.space')"></span>
      <span>{{ $t('index.slogan.text2') }}</span>
    </p>
    <div class="upload" :style="{width: $t('index.selectImg.width')}">
      <span>{{ $t('index.selectImg.text') }}</span>
      <input type="file" class="upload" @change="addImg" ref="inputer" accept="image/*" />
    </div>
    <p class="description" :style="{letterSpacing: $t('index.description.letterSpacing')}">{{ $t('index.description.text1') }}</p>
    <p class="description" :style="{letterSpacing: $t('index.description.letterSpacing')}">{{ $t('index.description.text2') }}</p>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  data() {
    return {
      wide: false
    }
  },
  methods: {
    addImg() {
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      if (inputDOM.files.length == 1) {
        /*
        let size = Math.floor(inputDOM.files[0].size / 1024);
        if (size > 5 * 1024 * 1024) {
          alert('请选择5M以内的图片！');
          return false;
        }
        */
        const fileInfo = {
          file: inputDOM.files[0],
          id: new Date().getTime()
        };
        this.$store.commit('setUserImgInfo', fileInfo);
        this.$emit('navTo', 'editor', fileInfo.id);
      }
    }
  },
  mounted () {
    this.wide = this.$refs.index.clientWidth > 500;
  }
}
</script>

<style scoped>
.example {
  width: 100%;
  max-width: 400px;
}
.title {
  font-size: 20px;
  font-weight: bolder;
  line-height: 35px;
  color: #ff664d;
}
.slogan {
  font-size: 18px;
  line-height: 28px;
  color: #ff8571;
}
.title, .slogan {
  margin: 0px 5px;
}
.description {
  margin: 0px 15px 15px 15px;
}
.description {
  color: #888;
  text-align: justify;
}
.upload {
  position: relative;
  height: 60px;
  margin: 20px auto;
  background: #ff8571;
  border-radius: 30px;
  font-size: 16px;
  box-shadow: 0px 0px 10px #ccc;
}
.upload:hover {
  background: #ff664d;
}
.upload span{
  display: block;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 20px;
  line-height: 60px;
}
.upload input {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0px;
  width: 160px;
  height: 60px;
  opacity: 0;
}
</style>
