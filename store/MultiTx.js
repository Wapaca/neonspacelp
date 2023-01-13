export const state = () => ({
  actions: [], // array of array of actions
  results: [], // array of tx state
})

export const mutations = {
	setActions: (state, actions) => state.actions = actions,
	setResults: (state, results) => state.results = results,
}

export const actions = {
	async sendTx({commit, dispatch, state}, i) {
		dispatch('chain/sendTransaction',
		  {
		    updateRoute: 'MultiTx/TxSent',
		    updateFailedRoute: 'MultiTx/TxFailed',
		    updateDelay: 500,
		    updateParam: i,
		    actions: state.actions[i]
		  },
		  {root: true}
		)

		let results = state.results.slice()
		results[i] = 'loading'
		commit('setResults', results)
	},
	async TxSent({commit, state}, {updateParam}) {
    let results = state.results.slice()
		results[updateParam] = 'sent'
		commit('setResults', results)
  },
  async TxFailed({commit, state}, {updateParam}) {
    let results = state.results.slice()
		results[updateParam] = 'ready'
		commit('setResults', results)
  },
	initModal({commit, dispatch}, actions) {
		const maxTx = 20
		
		let commitActions = [];
		let commitResults = [];
		commit('setActions', commitActions)
	  commit('setResults', commitResults)
	  for (let i = 0; i < actions.length; i += maxTx) {
	    commitActions.push(actions.slice(i, i + maxTx))
	    commitResults.push('ready')
	  }
	  commit('setActions', commitActions)
	  commit('setResults', commitResults)

	  dispatch('modal/open', 'MultiTx', {root: true})
	}
}

export const getters = {

}