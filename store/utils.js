export const state = () => ({

})

export const mutations = {

}

export const actions = {

}

export const getters = {
  precise: () => (price, precision) => Number.parseFloat(price).toFixed(precision)
}