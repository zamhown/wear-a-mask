<template>
  <div id="app">
    <div id="indexUI" :class="{'show-language-list': showLanguageList}">
      <div id="header" :style="{height: $t('logo.height') + 'vh'}">
        <img id="logo" :src="logoBaseUrl + $t('logo.filename')">
        <little-button id="language" @click="language" :width="$t('languageBtn.width')" icon="language" :text="$t('languageBtn.text')" />
        <a id="forkMe" href="https://github.com/zamhown/wear-a-mask">Fork me on GitHub!</a>
      </div>
      <div id="contentContainer" :style="{height: 100 - $t('logo.height') + 'vh'}">
        <div id="content">
          <Index v-show="nav=='index'" @navTo="navTo" />
          <Editor v-show="nav=='editor'" :fileId="currentFileId" @navTo="navTo" />
          <Export v-if="nav=='export'" @navTo="navTo" />
          <Share v-if="nav=='share'" @navTo="navTo" />
        </div>
      </div>
    </div>
    <div v-if="showLanguageList" id="languageLayer">
      <div :style="{width: $t('languageList.width')}">
        <p>
          <b>{{$t('languageList.title')}}</b>
        </p>
        <ul>
          <li v-for="(v, k) in $i18n.messages" :key="k" :class="{selected: $i18n.locale == k}" @click="selectLanguage(k)">{{v.language}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import Index from './components/Index.vue'
import Editor from './components/Editor.vue'
import Export from './components/Export.vue'
import Share from './components/Share.vue'
import LittleButton from './components/LittleButton'

import urls from './utils/urls'
import util from './utils/util'

export default {
  name: 'app',
  components: {
    Index,
    Editor,
    Export,
    Share,
    LittleButton
  },
  data() {
    return {
      logoBaseUrl: urls.assetsBaseUrl,
      nav: 'index',
      currentFileId: 0,
      showLanguageList: false
    }
  },
  methods: {
    navTo(where, data) {
      this.nav = where;
      if (data) {
        this.currentFileId = data;
      }
    },
    language() {
      this.showLanguageList = true;
    },
    selectLanguage(lang) {
      this.showLanguageList = false;
      this.$i18n.locale = lang;
      util.setLang(lang);
    }
  },
  created () {
    document.title = this.$t('title');
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  user-select: none;
}
html, body, p, ul, li {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: white;
  color: #2c3e50;
}
#header, #contentContainer {
  max-width: 600px;
}
#header {
  position: relative;
  margin: 0px auto;
}
#logo {
  height: 100%;
}
#forkMe {
  display: block;
  position: absolute;
  top: 0px;
  right: 20px;
  background: #f2bb43;
  color: white;
  text-decoration: none;
  font-size: 14px;
  line-height: 14px;
  font-family: 'Times New Roman', Times, serif;
  padding: 8px 15px;
  border-radius: 0px 0px 20px 20px;
  box-shadow: 0px 0px 10px #ccc;
}
#language {
  position: absolute;
  top: 5px;
  left: 20px;
}
#contentContainer {
  position: relative;
  margin: 0px auto;
  padding: 0px 15px 15px 15px;
}
#content {
  height: 100%;
  border: 2px solid #ff9c92;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
  overflow-y: auto;
  overflow-x: hidden;
}
#indexUI.show-language-list {
  filter: blur(20px);
}
#languageLayer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
}
#languageLayer > div {
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
#languageLayer p {
  height: 40px;
  line-height: 40px;
}
#languageLayer li {
  list-style: none;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
}
#languageLayer li.selected {
  background: #f5dcd9 !important;
}
#languageLayer li:hover {
  background: #eee;
}
</style>
