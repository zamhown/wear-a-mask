import Vue from 'vue'
import VueI18n from 'vue-i18n'
import util from '../utils/util'
import en from './lang/en'
import chs from './lang/chs'

var messages = {
  en,
  chs
}

var hash = (() => {
  if (location.hash) {
    return location.hash.substring(1)
  } else {
    return ''
  }
})()

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: util.getLang(messages[hash] ? hash : 'en'),
  messages
})

export default i18n