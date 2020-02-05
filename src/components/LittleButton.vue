<template>
  <button @click="click" :style="{width: width}">
    <img v-if="icon=='language'" src="../assets/icon-language.svg">
    <img v-if="icon=='reset'" src="../assets/icon-reset.svg">
    <img v-if="icon=='share'" src="../assets/icon-share.svg">
    <span>{{ text }}</span>
  </button>
</template>

<script>
/* eslint-disable no-console */

export default {
  props: {
    text: String,
    icon: String,
    width: String
  },
  methods: {
    click (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
button:hover {
  background: #f5dcd9;
}
button {
  width: auto;
  height: 25px;
  margin: 0 auto;
  padding: 1px 6px;
  background: white;
  border-radius: 13px;
  appearance: none;
  border: none;
  box-shadow: 0px 0px 5px #ccc;
  opacity: 0.6;
  display: flex;
}
button > * {
  display: block;
  height: 14px;
}
button span {
  font-size: 13.3333px;
  line-height: 14px;
  margin-left: 5px;
}
</style>
