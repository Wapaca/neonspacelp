export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const precise = (price, precision) => { return Number.parseFloat(price).toFixed(precision) }
export const formatPrice = (price) => { return Number.parseFloat(price).toFixed(2) }
export const extractTokenBalFromBal = (bal, precision = 2) => {
  bal = bal.split(' ')
  return Number.parseFloat(bal[0]*1).toFixed(precision)
}
export const extractTokenNameFromBal = (bal) => {
  bal = bal.split(' ')
  return bal[1]
}

export const shuffleArray = (array) => {
  let curId = array.length;
  // There remain elements to shuffle
  while (0 !== curId) {
    // Pick a remaining element
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    // Swap it with the current element.
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}