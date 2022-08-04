export default ({ app: { store } }, inject) => {
  window.onNuxtReady(() => {
    let lastWallet = localStorage.getItem("lastWallet");
    if(lastWallet) {
      store.dispatch('chain/setLastWallet', lastWallet)
    }

    store.dispatch('chain/init')
  })
}
