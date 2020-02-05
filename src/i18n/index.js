import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './lang/en'
import chs from './lang/chs'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'chs',
  messages: {
    en,
    chs
  }
})

export default i18n