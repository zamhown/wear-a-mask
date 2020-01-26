<template>
  <div id="app">
    <div id="header">
      <img id="logo" src="./assets/logo-title.svg">
      <a id="forkMe" href="https://github.com/zamhown/wear-a-mask">Fork me on GitHub!</a>
    </div>
    <div id="contentContainer">
      <div id="content">
        <Index v-show="nav=='index'" @navTo="navTo" />
        <Editor v-show="nav=='editor'" :fileId="currentFileId" @navTo="navTo" />
        <Export v-if="nav=='export'" @navTo="navTo" />
      </div>
    </div>
  </div>
</template>

<script>
import Index from './components/Index.vue'
import Editor from './components/Editor.vue'
import Export from './components/Export.vue'

export default {
  name: 'app',
  components: {
    Index,
    Editor,
    Export
  },
  data() {
    return {
      nav: 'index',
      currentFileId: 0
    }
  },
  methods: {
    navTo(where, data) {
      this.nav = where;
      if (data) {
        this.currentFileId = data;
      }
    }
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
  color: #2c3e50;
}
#header, #contentContainer {
  max-width: 600px;
}
#header {
  position: relative;
  height: 25vh;
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
#contentContainer {
  position: relative;
  height: 75vh;
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
</style>
