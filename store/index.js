import {getTopHolders} from '~/utils/lightapihelper.js'

export const state = () => ({
  user: null,
  network: {},
  blockNum: null,
  account: null,

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
  setUser: (state, user) => state.user = user,
  setNetwork: (state, network) =>  state.network = network,
  setAccount: (state, account) => state.account = account,
  setBlockNum: (state, block) => state.blockNum = block,

  updateExcludeWalletActive: (state, excludeWalletActive) => state.excludeWalletActive = excludeWalletActive,
  setExchange: (state, exchange) => state.exchange = exchange,
  setTopLP: (state, topLP) => state.topLP = topLP,
  setDisplayedTopLP: (state, displayedTopLP) => state.displayedTopLP = displayedTopLP,
  setTotalLPamount: (state, totalLPamount) => state.totalLPamount = totalLPamount,
  setTotalNeonReward: (state, totalNeonReward) => state.totalNeonReward = totalNeonReward,
  updateIsLPLoading: (state, isLPLoading) => state.isLPLoading = isLPLoading,
  addExcludedWallets: (state, excludedWallet) => state.excludedWallets.push(excludedWallet),
  remExcludedWallets: (state, excludedWallet) => state.excludedWallets = state.excludedWallets.filter(w => w !== excludedWallet),
}

export const actions = {
  async loadAccountData({ state, commit, dispatch }) {
    if (!state.user) return

    const account = await this.$rpc.get_account(state.user.name)
    commit('setAccount', account)
    commit('setBlockNum', account.head_block_num)
  },
  async updateTotalLPamount({commit, state}) {
    let lpAmount = 0
    for(let i = 0; i < state.topLP.length; ++i)
      if(state.excludedWallets.indexOf(state.topLP[i][0]) === -1)
        lpAmount += state.topLP[i][1]*1

    commit('setTotalLPamount', lpAmount)
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
  async fetchTopLP({commit, state, dispatch}) {
    commit('updateIsLPLoading', true)
    const ticker = (state.exchange === 'defibox') ? 'BOXX' : 'WAXNEON'
    const contract = (state.exchange === 'defibox') ? 'lptoken.box' : 'alcorammswap'
    const topLP = await getTopHolders(this.$axios, ticker, contract)
    commit('setTopLP', topLP)
    dispatch('updateDisplayedTopLP')
    dispatch('updateTotalLPamount')
    commit('updateIsLPLoading', false)
  },
}

export const getters = {
  user: (state) => () => {
    return state.user
  },
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