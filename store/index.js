export const state = () => ({
  user: null,
  network: {},
  lihgHistoryBlock: null,
  blockNum: null,
  account: null,
})

export const mutations = {
  setUser: (state, user) => state.user = user,
  setNetwork: (state, network) =>  state.network = network,
  setLihgHistoryBlock: (state, block) => state.lihgHistoryBlock = block,
  setBlockNum: (state, block) => state.blockNum = block,
}

export const actions = {

}

export const getters = {
  user: (state) => () => {
    return state.user
  },
}