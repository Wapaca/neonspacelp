import {getTopHolders} from '~/utils/lightapihelper.js'
import { precise, isTicksAtLimit } from '~/utils/utils.js'
import { Token, tickToPrice } from '@alcorexchange/alcor-swap-sdk'

export const state = () => ({
  excludeWalletActive: false,
  exchange: 'defibox',
  poolType: 'uniswap-v2',
  isLPLoading: true,
  // Alcor v2
  pool: null,
  positions: [],
  displayedPositions: [],
  // Taco & Defibox
  topLP: [],
  displayedTopLP: [],
  excludedWallets: [],
  totalLPamount: 0,
  totalNeonReward: 0,
})

export const mutations = {
  updateExcludeWalletActive: (state, excludeWalletActive) => state.excludeWalletActive = excludeWalletActive,
  setExchange: (state, exchange) => state.exchange = exchange,
  setPoolType: (state, type) => state.poolType = type,
  setPool: (state, pool) => state.pool = pool,
  setPositions: (state, positions) => state.positions = positions,
  setDisplayedPositions: (state, positions) => state.displayedPositions = positions,
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
  resetList({ commit }) {
    commit('setPositions', [])
    commit('setDisplayedPositions', [])
    commit('setTopLP', [])
    commit('setDisplayedTopLP', [])
    commit('setTotalLPamount', 0)
  },
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

    if(state.poolType === 'uniswap-v3') {

    }
    else {
      for(let i = 0; i < state.topLP.length; ++i)
        if(state.excludedWallets.indexOf(state.topLP[i][0]) === -1)
          lpAmount += state.topLP[i][1]*1
    }

    commit('setTotalLPamount', lpAmount)
  },
  async setExcludedWallets({commit}, excludedWallets) {
    commit('setExcludedWallets', excludedWallets)
  },
  async switchExcludeWallets({commit, state, dispatch}) {
    // disable
    if(state.excludeWalletActive) {
      commit('updateExcludeWalletActive', false)
      if(state.poolType === 'uniswap-v3')
        dispatch('updateDisplayedPositions')
      else
        dispatch('updateDisplayedTopLP')
    }
    else {
      commit('updateExcludeWalletActive', true)

      if(state.poolType === 'uniswap-v3')
        commit('setDisplayedPositions', state.positions.sort(
          (a, b) => Number(b.liquidity) - Number(a.liquidity)
        ));
      else
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
  async updateDisplayedPositions({ commit, state }) {
    const displayedPositions = state.positions.filter(
      p => state.excludedWallets.indexOf(p.owner) === -1
    ).sort(
      (a, b) => Number(b.liquidity) - Number(a.liquidity)
    );
    commit('setDisplayedPositions', displayedPositions )
  },
  async setTotalNeonReward({commit}, event) {
    const amount = 1* event.target.value
    commit('setTotalNeonReward', amount)
  },
  async changeExchange({ commit, dispatch }, exchange) {
    dispatch('resetList')
    commit('setExchange', exchange)

    if(['defibox', 'taco'].indexOf(exchange) !== -1) {
      commit('setPoolType', 'uniswap-v2')
      dispatch('fetchTopLP')
    }
    else {
      commit('setPoolType', 'uniswap-v3')
      dispatch('fetchPoolsAndPositions')
    }
  },
  async fetchPoolsAndPositions({ commit, dispatch, state }) {
    commit('updateIsLPLoading', true)
    const NEON_POOLID = 409;
    const poolReq = await this.$axios.get('https://wax.alcor.exchange/api/v2/swap/pools/'+NEON_POOLID)
    commit('setPool', poolReq.data)

    const positionsReq = await this.$axios.get('https://wax.alcor.exchange/api/v2/swap/pools/'+NEON_POOLID+'/positions')
    const positions = positionsReq.data.map(p => {
      const tokenA = new Token(
        state.pool.tokenA.contract,
        state.pool.tokenA.decimals,
        state.pool.tokenA.symbol,
        state.pool.tokenA.id
      );
      const tokenB = new Token(
        state.pool.tokenB.contract,
        state.pool.tokenB.decimals,
        state.pool.tokenB.symbol,
        state.pool.tokenB.id
      );

      // Order of tokens into tickToPrice reverse + tickUpper and tickLower too so it fits to NEON/WAX price
      p.priceLower = isTicksAtLimit(state.pool.fee, p.tickLower, p.tickUpper).LOWER ? '0' : tickToPrice(tokenB, tokenA, p.tickUpper).toSignificant(5);
      p.priceUpper = isTicksAtLimit(state.pool.fee, p.tickLower, p.tickUpper).UPPER ? '∞' : tickToPrice(tokenB, tokenA, p.tickLower).toSignificant(5);

      return p;
    });
    commit('setPositions', positions)
    dispatch('updateDisplayedPositions')
    dispatch('updateTotalLPamount')
    commit('updateIsLPLoading', false)
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
  },
  isPositionInRange: (state) => (position) => {
    return position.tickLower <= state.pool.tick && state.pool.tick <= position.tickUpper
  }
}