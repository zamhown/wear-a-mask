<template>
  <div id="editor" ref="editor">
    <div id="editorUI" :class="{'loading': loading}">
      <div ref="canvasContainer">
      </div>
      <button id="resumeBtn" @click="resumeMask">重置</button>
      <div id="maskStore" ref="maskStore">
        <p class="title">更换口罩</p>
        <div class="list">
          <ul>
            <li v-for="m in maskData.masks" :key="m.name" @click="changeMask(m)">
              <img :src="maskData.baseUrl + m.name">
            </li>
          </ul>
        </div>
      </div>
      <div class="control" ref="control">
        <button id="reuploadBtn" @click="reupload">重选图片</button>
        <button id="saveBtn" @click="save">保存图片</button>
      </div>
    </div>
    <div v-if="loading" id="loading">
      <div>
        <p>
          <b>正在进行人脸检测，请稍等……</b>
          <br>
          由于算法全程在浏览器运行，
          <br>
          运算速度可能取决于设备性能。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import faceApiUtil from '../utils/faceApiUtil';
import StickerCanvas from '../utils/stickerCanvas';
import maskData from '../utils/maskData';
import maskHelper from '../utils/maskHelper';

export default {
  props: {
    fileId: Number
  },
  data() {
    return {
      currentFileId: 0,
      editor: null,
      canvas: null,
      maskData: maskData,
      maskInfo: null,
      realImgInfo: null,
      loading: false
    }
  },
  methods: {
    loadImg(file) {
      if (this.canvas) {
        this.canvas.remove();
      }
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.$refs.editor.clientWidth;
      this.canvas.height = this.$refs.editor.clientHeight - this.$refs.maskStore.clientHeight - this.$refs.control.clientHeight;
      this.$refs.canvasContainer.appendChild(this.canvas);
      this.editor = new StickerCanvas({
        canvas: this.canvas,
        target: this.canvas,
        width: this.canvas.width,
        height: this.canvas.height
      });
      const editor = this.editor;
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);  // 发起异步请求
      reader.onload = function () {
        const img = new Image();
        img.src = this.result;
        img.onload = function () {
          // 等比例缩放图片
          const xRate = editor.width / img.width;
          const yRate = editor.height / img.height;
          const setRate = xRate < yRate ? xRate : yRate;
          const imgWidth = img.width * setRate;
          const imgHeight = img.height * setRate;
          const imgX = (editor.width - imgWidth) / 2;
          const imgY = (editor.height - imgHeight) / 2;
          editor.addPhoto(img, {
            width: imgWidth,
            height: imgHeight,
            centerX: editor.width / 2,
            centerY: editor.height / 2,
            angle: 0
          }, false);
          self.realImgInfo = {
            width: imgWidth,
            height: imgHeight,
            position: [imgX, imgY]
          };
          self.loading = true;
          faceApiUtil.detectPic(img, editor, self.realImgInfo, maskInfo => {
            self.maskInfo = maskInfo;
            self.loading = false;
          }, e => {
            console.log(e);
            self.maskInfo = maskHelper.wearAMaskAsAFool(self.editor, self.realImgInfo);
            self.loading = false;
          });
        }
      }
    },
    resumeMask () {
      if (this.maskInfo && this.editor) {
        maskHelper.resumeMask(this.maskInfo, this.editor, this.realImgInfo);
      }
    },
    changeMask (m) {
      if (this.maskInfo && this.editor) {
        maskHelper.changeMask(m, this.editor);
      }
    },
    reupload () {
      this.$emit('navTo', 'index');
    },
    save () {
      this.$store.commit('setExportData', {
        url: this.editor.export(),
        width: this.realImgInfo.width,
        height: this.realImgInfo.height
      });
      this.$emit('navTo', 'export');
    }
  },
  watch: {
    fileId (v) {
      if (v != this.currentFileId && this.$store.state.userImgInfo && v == this.$store.state.userImgInfo.id) {
        this.loadImg(this.$store.state.userImgInfo.file);
        this.currentFileId = v;
      }
    }
  }
}
</script>

<style scoped>
#editor, #editorUI {
  position: relative;
  width: 100%;
  height: 100%;
}
#maskStore {
  position: absolute;
  width: 100%;
  bottom: 60px;
  background: #f3b8b1;
}
#maskStore .title {
  background: #ff664d;
  color: white;
  height: 30px;
  line-height: 30px;
}
#maskStore .list {
  overflow-x: auto;
  overflow-y: hidden;
  height: 90px;
}
#maskStore ul {
  width: auto;
  white-space: nowrap;
}
#maskStore li {
  position: relative;
  width: 80px;
  height: 80px;
  font-size: 14px;
  display: inline-block;
  margin: 5px;
  padding: 5px;
  text-align: center;
  vertical-align: middle;
}
#maskStore li:hover {
  border: 1px dashed #666;
  border-radius: 5px;
}
#maskStore img {
  position: relative;
  width: 100%;
  vertical-align: middle;
}
.control {
  position: absolute;
  width: 100%;
  bottom: 0px;
  height: 60px;
  background: #ff664d;
}
.control button {
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
#resumeBtn {
  position: absolute;
  top: 0px;
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
#editorUI.loading {
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
  width: 280px;
  height: 94px;
  padding: 10px;
  margin: -47px 0px 0px -140px;
  background: white;
  border-radius: 5px;
  font-size: 16px;
  line-height: 25px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>
