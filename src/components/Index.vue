<template>
  <div ref="index">
    <p><img class="example" src="../assets/example.png"></p>
    <p class="title">疫情当前，有罩才稳</p>
    <p class="slogan"><span v-if="!wide" v-html="space"></span>给社交网络头像戴上口罩，<br v-if="!wide"><span v-if="!wide" v-html="space"></span>提醒更多人关注身体健康。</p>
    <div class="upload">
      <span>选择图片</span>
      <input type="file" class="upload" @change="addImg" ref="inputer" accept="image/png,image/jpeg,image/gif,image/jpg"/>
    </div>
    <p class="description">此页面可以在你的头像上自动P上口罩，你还可以对口罩的位置和大小进行编辑。</p>
    <p class="description">人脸检测算法基于SSD MobileNet V1神经网络模型，无需上传图片，也不会保留任何数据。</p>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  data() {
    return {
      space: '　',
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
  letter-spacing: 4px;
}
.slogan {
  font-size: 18px;
  line-height: 28px;
  color: #ff8571;
  letter-spacing: 2px;
}
.description {
  color: #888;
  margin: 0px 15px 15px 15px;
  text-align: justify;
  letter-spacing: 1px;
}
.upload {
  position: relative;
  width: 160px;
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
