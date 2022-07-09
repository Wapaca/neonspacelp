export default ({ app: { store } }, inject) => {
  window.onNuxtReady(() => {

    store.dispatch('chain/init')
  })
}
