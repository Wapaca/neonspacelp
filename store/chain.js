import WCW from '~/plugins/wallets/WCW'
import AnchoWallet from '~/plugins/wallets/Anchor'
import ScatterWallet from '~/plugins/wallets/Scatter'
import {precise} from '~/utils/utils.js'

export const state = () => ({
  loginPromise: null,
  wallets: {},
  payForUser: false,
  currentWallet: 'anchor',
  lastWallet: null
})

export const mutations = {
  setWallets: (state, value) => state.wallets = value,
  setLoginPromise: (state, value) => state.loginPromise = value,
  setPayForUser: (state, value) => state.payForUser = value,
  setCurrentWallet: (state, value) => state.currentWallet = value,
  setLastWallet: (state, value) => state.lastWallet = value
}

export const getters = {
  chainName: (state, getters, rootState) => rootState.network.name,
  wallet: (state, getters) => state.wallets[state.currentWallet]
}

export const actions = {
  init({ state, commit, dispatch, rootState, rootGetters, getters }) {
    const { network } = rootState

    const wallets = {
      anchor: new AnchoWallet(network, this.$rpc),
      scatter: new ScatterWallet(network, this.$rpc),
      wcw: new WCW(network, this.$rpc)
    }

    commit('setWallets', wallets)

    if (state.lastWallet) {
      commit('setCurrentWallet', state.lastWallet)
      dispatch('autoLogin')
    }
  },

  async autoLogin({ state, dispatch, commit, getters }) {
    return;
    console.log('try autoLogin..')
    const loginned = await getters.wallet.checkLogin()
    console.log(loginned)
    if (loginned) {
      const { name, authorization } = loginned
      commit('setUser', { name, authorization }, { root: true })
      //dispatch('afterLoginHook')

      return true
    }
    return false
  },

  afterLoginHook({ dispatch, rootState }) {
    return;
  },

  logout({ state, dispatch, commit, getters, rootState }) {
    getters.wallet.logout()
    commit('setLastWallet', null)
    commit('setUser', null, { root: true })
  },

  async login({ state, commit, dispatch, getters, rootState }, wallet_name) {
    commit('setCurrentWallet', wallet_name)
    const { name, authorization } = await getters.wallet.login()

    commit('setUser', { name, authorization }, { root: true })
    //dispatch('afterLoginHook')

    commit('setLastWallet', wallet_name)
  },

  // Function not used in the app yet
  sendRewards({ dispatch, rootState }, { rewards }) {
    let actions = []
    for(let i = 0; i < rewards.length; ++i) {
      actions.push({
        account: 'tokenizednft',
        name: 'transfer',
        authorization: [
          rootState.user.authorization
        ],
        data: {
          from: rootState.user.name,
          to: rewards[i].wallet,
          quantity: precise(rewards[i].reward, 4)+' NEON',
          memo: 'Defibox NEON LP weekly rewards'
        }
      })
    }
    return dispatch('sendTransaction',
      {
        updateRoute: null,
        updateDelay: 4000,
        actions: actions
      }
    )
  },
  async sendTransaction({ state, rootState, dispatch, getters, commit }, {actions, updateRoute, updateDelay, updateParam}) {
    try {
      const res = await getters.wallet.transact(actions)
      let tx_id = res.transaction_id
      if(res.processed !== undefined)
        if(res.processed.id !== undefined)
          tx_id = res.processed.id

      this._vm.$notify({
        duration: this.$notificationDuration,
        type: 'success',
        title: 'Transaction successful',
        text: '<a href="https://wax.bloks.io/transaction/'+tx_id+'/" target="_blank">Tx id: '+tx_id+'</a>'
      })
      return res
    } catch (e) {
      this._vm.$notify({
        duration: this.$notificationDuration,
        type: 'error',
        title: 'Transaction error',
        text: e
      })
      //throw e
    } finally {
      if(updateRoute !== null)
        setTimeout(() => {dispatch(updateRoute, {updateParam}, { root: true })}, updateDelay)
    }
  }
}
