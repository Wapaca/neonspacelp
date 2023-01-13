export const state = () => ({
  current: '',
  visible: false
})

export const mutations = {
  setCurrent: (state, value) => state.current = value,
  setVisible: (state, value) => state.visible = value
}

export const actions = {
  login({ commit, dispatch }) {
    commit('setCurrent', 'login') 
    commit('setVisible', true)
  },
  open({commit, dispatch}, name) {
    commit('setCurrent', name) 
    commit('setVisible', true)
  },
  closeModal({ commit }) {
    commit('setVisible', false)
  }
}
