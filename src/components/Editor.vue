<template>
  <div id="editor" ref="editor">
    <div id="editorUI" :class="{'loading': loading}">
      <div ref="canvasContainer">
      </div>
      <little-button id="resetBtn" @click="resetMask" :width="$t('editor.reset.width')" icon="reset" :text="$t('editor.reset.text')" />
      <div id="maskStore" ref="maskStore">
        <p class="title">{{ $t('editor.changeMask') }}</p>
        <div class="list">
          <ul>
            <li v-for="m in maskData.masks" :key="m.name" @click="changeMask(m)">
              <img :src="maskData.baseUrl + m.name">
            </li>
          </ul>
        </div>
      </div>
      <div class="control" ref="control">
        <button id="reuploadBtn" @click="reupload" :style="{width: $t('editor.reselectImg.width')}">{{ $t('editor.reselectImg.text') }}</button>
        <button id="saveBtn" @click="save" :style="{width: $t('editor.saveImg.width')}">{{ $t('editor.saveImg.text') }}</button>
      </div>
    </div>
    <div v-if="loading" id="loading">
      <div :style="{width: $t('editor.loading.width'), height: $t('editor.loading.height')}">
        <p>
          <b>{{ $t('editor.loading.title') }}</b>
          <br>
          {{ $t('editor.loading.text1') }}
          <br>
          {{ $t('editor.loading.text2') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import LittleButton from './LittleButton'
import faceApiUtil from '../utils/faceApiUtil';
import StickerCanvas from '../utils/stickerCanvas';
import maskData from '../utils/maskData';
import maskHelper from '../utils/maskHelper';
import util from '../utils/util';
import EXIF from 'exif-js';

export default {
  components: {
    LittleButton
  },
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
      //获取图片Orientation参数
      EXIF.getData(file, function () {
        console.log(EXIF.getAllTags(this));
        const EXIF_orientation = EXIF.getTag(this, 'Orientation');  // 解决移动设备照片方向问题
        const reader = new FileReader();
        reader.readAsDataURL(file);  // 发起异步请求
        reader.onload = function () {
          const img = new Image();
          img.src = this.result;
          img.onload = function () {
            let width = img.width;
            let height = img.height;
            let angle = 0;
            let orientation = 0;
            if(EXIF_orientation && EXIF_orientation != 1){
              switch(EXIF_orientation){
                // 旋转90度
                case 6:
                  angle = Math.PI / 2;
                  width = img.height;
                  height = img.width;
                  orientation = 90;
                  break;
                // 旋转180度
                case 3:
                  angle = Math.PI;
                  orientation = 180;
                  break;
                // 旋转270度
                case 8:
                  angle = 3 * Math.PI / 2;
                  width = img.height;
                  height = img.width;
                  orientation = 270;
                  break;
              }
            }
            // 等比例缩放图片
            const {imgWidth, imgHeight, imgX, imgY, rate} = util.imgContain(editor.width, editor.height, width, height);
            editor.addPhoto(img, {
              width: img.width * rate,
              height: img.height * rate,
              centerX: editor.width / 2,
              centerY: editor.height / 2,
              angle: angle
            }, false, orientation);
            self.realImgInfo = {
              width: imgWidth,
              height: imgHeight,
              position: [imgX, imgY]
            };
            self.loading = true;

            setTimeout(() => {    
              const rimg = new Image();
              rimg.src = editor.export();  // 放进算法前导出一次确保图片方向正确
              rimg.onload = function () {
                faceApiUtil.detectPic(rimg, editor, self.realImgInfo, maskInfo => {
                  self.maskInfo = maskInfo;
                  self.loading = false;
                }, e => {
                  console.log(e);
                  self.maskInfo = maskHelper.wearAMaskAsAFool(self.editor, self.realImgInfo);
                  self.loading = false;
                });
              }
            }, 300);  // 留时间刷新界面
          }
        }
      });
    },
    resetMask () {
      if (this.maskInfo && this.editor) {
        maskHelper.resetMask(this.maskInfo, this.editor, this.realImgInfo);
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
      this.$store.commit('setEditor', this.editor);
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
  height: 40px;
  margin: 10px;
  background: white;
  border-radius: 20px;
  appearance: none;
  border: none;
  font-size: 16px;
  box-shadow: 0px 0px 5px #888;
}
.control button:hover {
  background: #f5dcd9;
}
#resetBtn {
  position: absolute;
  top: 0px;
  right: 0px;
  margin: 10px;
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
  position: relative;
  padding: 10px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  background: white;
  border-radius: 5px;
  font-size: 16px;
  line-height: 25px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>
