import {getTopHolders} from '~/utils/lightapihelper.js'
import {precise} from '~/utils/utils.js'

export const state = () => ({
  excludeWalletActive: false,
  exchange: 'defibox',
  isLPLoading: true,
  topLP: [],
  displayedTopLP: [],
  excludedWallets: [],
  totalLPamount: 0,
  totalNeonReward: 0,
})

export const mutations = {
  updateExcludeWalletActive: (state, excludeWalletActive) => state.excludeWalletActive = excludeWalletActive,
  setExchange: (state, exchange) => state.exchange = exchange,
  setTopLP: (state, topLP) => state.topLP = topLP,
  setDisplayedTopLP: (state, displayedTopLP) => state.displayedTopLP = displayedTopLP,
  setTotalLPamount: (state, totalLPamount) => state.totalLPamount = totalLPamount,
  setTotalNeonReward: (state, totalNeonReward) => state.totalNeonReward = totalNeonReward,
  updateIsLPLoading: (state, isLPLoading) => state.isLPLoading = isLPLoading,
  setExcludedWallets: (state, excludedWallets) => state.excludedWallets = excludedWallets,
  addExcludedWallets: (state, excludedWallet) => state.excludedWallets.push(excludedWallet),
  remExcludedWallets: (state, excludedWallet) => state.excludedWallets = state.excludedWallets.filter(w => w !== excludedWallet),
}

export const actions = {
  async sendRewards({state, dispatch, getters}) {
    if(state.totalNeonReward === 0)
      return;

    let rewards = [];

    for(let i = 0; i < state.displayedTopLP.length; ++i) {
      const output = 1*precise(getters.getWalletNeonOutput(state.displayedTopLP[i][0]), 4)
      if(output >= 0.0001)
        rewards.push({wallet: state.displayedTopLP[i][0], reward: output})
    }

    dispatch('chain/sendRewards', {rewards}, { root: true })
  },
  async updateTotalLPamount({commit, state}) {
    let lpAmount = 0
    for(let i = 0; i < state.topLP.length; ++i)
      if(state.excludedWallets.indexOf(state.topLP[i][0]) === -1)
        lpAmount += state.topLP[i][1]*1

    commit('setTotalLPamount', lpAmount)
  },
  async setExcludedWallets({commit}, excludedWallets) {
    commit('setExcludedWallets', excludedWallets)
  },
  async switchExcludeWallets({commit, state, dispatch}) {
    // disable
    if(state.excludeWalletActive) {
      commit('updateExcludeWalletActive', false)
      dispatch('updateDisplayedTopLP')
    }
    else {
      commit('updateExcludeWalletActive', true)
      commit('setDisplayedTopLP', state.topLP)
    }
  },
  async addExcludeWallet({commit, dispatch}, wallet) {
    commit('addExcludedWallets', wallet)
    dispatch('updateTotalLPamount')
  },
  async remExcludeWallet({commit, dispatch}, wallet) {
    commit('remExcludedWallets', wallet)
    dispatch('updateTotalLPamount')
  },
  async updateDisplayedTopLP({commit, state}) {
    const displayedTopLP = state.topLP.filter(h => state.excludedWallets.indexOf(h[0]) === -1)
    commit('setDisplayedTopLP', displayedTopLP)
  },
  async setTotalNeonReward({commit}, event) {
    const amount = 1* event.target.value
    commit('setTotalNeonReward', amount)
  },
  async changeExchange({ commit, dispatch }, exchange) {
    commit('setExchange', exchange)

    if(['defibox', 'taco'].indexOf(exchange) !== -1)
      dispatch('fetchTopLP')
  },
  async fetchTopLP({commit, state, dispatch}) {
    commit('updateIsLPLoading', true)
    const tickers = {
      'defibox': 'BOXX',
      'taco': 'NEOWAX',
    }
    const contracts = {
      'defibox': 'lptoken.box',
      'taco': 'swap.taco'
    }
    const topLP = await getTopHolders(this.$axios, tickers[state.exchange], contracts[state.exchange])
    commit('setTopLP', topLP)
    dispatch('updateDisplayedTopLP')
    dispatch('updateTotalLPamount')
    commit('updateIsLPLoading', false)
  },
}

export const getters = {
  getWalletNeonOutput: (state, getters) => (wallet) => {
    return getters.getWalletShare(wallet) * state.totalNeonReward / 100
  },
  getWalletShare: (state, getters) => (wallet) => {
    if(getters.isWalletExcluded(wallet))
      return 0

    const walletLP = state.topLP.filter(h => h[0] === wallet)
    return 100*walletLP[0][1] / state.totalLPamount
  },
  isWalletExcluded: (state) => (wallet) => {
    return state.excludedWallets.indexOf(wallet) !== -1
  }
}