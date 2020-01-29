import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// initial state
const state = {
  userImgInfo: null,
  editor: null,
  finishImg: null
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  setUserImgInfo (state, data) {
    state.userImgInfo = data
  },
  setEditor (state, data) {
    state.editor = data
  },
  setFinishImg (state, data) {
    state.finishImg = data
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
