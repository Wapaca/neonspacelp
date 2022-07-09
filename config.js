const networks = {
  wax: {
    name: 'wax',
    desc: 'WAX Mainnet',

    chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
    host: 'wax.greymass.com',
    port: 443,
    protocol: 'https',
    client_nodes: {
      'https://wax.greymass.com': 'Greymass - Canada',
      'https://wax.eu.eosamsterdam.net': 'EOSAmsterdam - Amsterdam',
      'https://wax.eosn.io': 'EOS Nation - Canada',
      'https://wax.pink.gg': 'Pink GG - Germany',
    },
  },

}

module.exports = {
  networks,
}
