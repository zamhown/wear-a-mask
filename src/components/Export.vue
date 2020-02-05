<template>
  <div id="export">
    <div id="exportUI" :class="{'loading': loading}">
      <p class="img-container" ref="ic"><img :src="imgUrl" :style="imgStyle" @load="onImgLoaded"></p>
      <little-button id="shareBtn" @click="share" :width="$t('export.share.width')" icon="share" :text="$t('export.share.text')" />
      <div class="title" ref="title">
        <p>{{ $t('export.title') }}</p>
        <div class="control">
          <button @click="backToEditor" :style="{width: $t('export.backToEditor.width')}">{{ $t('export.backToEditor.text') }}</button>
          <button @click="backToIndex" :style="{width: $t('export.backToIndex.width')}">{{ $t('export.backToIndex.text') }}</button>
        </div>
      </div>
    </div>
    <div v-if="loading" id="loading">
      <div :style="{width: $t('export.loading.width'), height: $t('export.loading.height')}">
        <p>
          <b>{{ $t('export.loading.title') }}</b>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import LittleButton from './LittleButton'
import { mapState } from 'vuex';
import util from '../utils/util';

export default {
  components: {
    LittleButton
  },
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
#shareBtn {
  position: absolute;
  bottom: 0px;
  right: 0px;
  margin: 10px;
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
  position: relative;
  padding: 10px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  background: white;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>
