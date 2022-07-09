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
    dispatch('setMobileMenuVisible', false, { root: true })    
    commit('setVisible', true)
  },
  closeModal({ commit }) {
    commit('setVisible', false)
  }
}
