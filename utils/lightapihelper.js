import {delay, shuffleArray} from '~/utils/utils.js'

let endpoints = []

const setEndpoints = (ticker, contract) => {
  endpoints = shuffleArray([
    'https://www.api.bloks.io/wax/tokens?type=topHolders&chain=wax&contract='+contract+'&symbol='+ticker+'&limit=500',
    'https://wax.light-api.net/api/topholders/wax/'+contract+'/'+ticker+'/500',
    'https://lightapi.eosamsterdam.net/api/topholders/wax/'+contract+'/'+ticker+'/500'
  ])
}

const safeTopHolders = async(axios, selectedEndpoint = 0) => {
  if(endpoints[selectedEndpoint] === undefined) {
    throw 'Failed to fetch from topholders api'
    return;
  }

  try {
    const res = await axios.get(endpoints[selectedEndpoint])
    return res.data.slice(0, 100) // slice is to fix bloks io endpt which still return 500
  }
  catch(e) {
    console.warn(e)
    console.info('Retry with another topholders endpoint')
    await delay(100)
    ++selectedEndpoint
    return safeTopHolders(axios, selectedEndpoint)
  }
}

export const getTopHolders = async(axios, ticker, contract) => {
  setEndpoints(ticker, contract)
  const topHolders = await safeTopHolders(axios)

  return topHolders
}