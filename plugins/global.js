import fetch from 'node-fetch'

import { JsonRpc } from 'eosjs'
import { JsonRpc as JsonRpcMultiEnds } from '~/libs/eosjs-jsonrpc'
import config from '~/config'

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

export default ({ app: { store: { state, commit }, $axios }, req }, inject) => {
  commit('setNetwork', config.networks['wax'])

  const all_nodes = Object.keys(state.network.client_nodes)
  shuffleArray(all_nodes)
  const rpc = new JsonRpcMultiEnds(all_nodes, { fetch })
  inject('rpc', rpc)

  inject('notificationDuration', 10000)
}
