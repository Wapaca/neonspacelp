import {getTopHolders} from '~/utils/lightapihelper.js'

export const state = () => ({
  excludeWalletActive: false,
  exchange: 'defibox',
  isLPLoading: true,
  topLP: [],
  displayedTopLP: [],
  excludedWallets: [],
})

export const mutations = {
  updateExcludeWalletActive: (state, excludeWalletActive) => state.excludeWalletActive = excludeWalletActive,
  setExchange: (state, exchange) => state.exchange = exchange,
  setTopLP: (state, topLP) => state.topLP = topLP,
  setDisplayedTopLP: (state, displayedTopLP) => state.displayedTopLP = displayedTopLP,
  updateIsLPLoading: (state, isLPLoading) => state.isLPLoading = isLPLoading,
  addExcludedWallets: (state, excludedWallet) => state.excludedWallets.push(excludedWallet),
  remExcludedWallets: (state, excludedWallet) => state.excludedWallets = state.excludedWallets.filter(w => w !== excludedWallet),
}

export const actions = {
  async fetchTopLP({commit, state}) {
    commit('updateIsLPLoading', true)
    const ticker = (this.state.exchange === 'defibox') ? 'BOXX' : 'WAXNEON'
    const contract = (this.state.exchange === 'defibox') ? 'lptoken.box' : 'alcorammswap'
    const topLP = await getTopHolders(this.$axios, ticker, contract)
    commit('setTopLP', topLP)
    commit('updateIsLPLoading', false)
  },
}

export const getters = {

}