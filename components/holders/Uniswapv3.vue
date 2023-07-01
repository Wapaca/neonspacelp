<template>
<ul :class="'holders '+((excludeWalletActive) ? 'exclude' : '')">
  <li class="head">
    <div class="cell excludeCell">Exclude</div>
    <div class="cell">Rank</div>
    <div class="cell">Wallet</div>
    <div class="cell">Range</div>
    <div class="cell">Liquidity</div>
    <div class="cell">Share</div>
    <div class="cell">NEON reward</div>
  </li>
  <li class="body uniswapv3" v-for="(position, i) in displayedPositions">
    <div class="cell excludeCell">
      <div class="excludeButton" v-if="isWalletExcluded(position.owner)" @click="remExcludeWallet(position.owner)"><span><fa-icon :icon="['fas','check']" /></span></div>
      <div class="excludeButton" v-else @click="addExcludeWallet(position.owner)"></div>
    </div>
    <div class="cell">#{{1+i}}</div>
    <div class="cell">{{ position.owner }}</div>
    <div class="cell">{{ null }}</div>
    <div class="cell liquidity">
    	<div>{{ position.liquidity }}</div>
    	<div>{{ position.amountA }}</div>
    	<div>{{ position.amountB }}</div>
    </div>
    <div class="cell">{{ 0 }}%</div>
    <div class="cell">{{ 0 }}</div>
  </li>
  <li class="foot">
    <div class="cell doublecell">Total</div>
    <div class="cell">{{ totalLPamount }}</div>
    <div class="cell">100%</div>
    <div class="cell"><input @change="setTotalNeonReward($event)" :value="totalNeonReward" type="number" placeholder="0"/></div>
  </li>
</ul>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
	methods: {
		...mapActions('LPdistrib', [
			'setTotalNeonReward',
			'remExcludeWallet',
			'addExcludeWallet'
		])
	},
	computed: {
		...mapState('LPdistrib', [
			'excludeWalletActive',
			'displayedPositions',
			'totalNeonReward',
			'totalLPamount'
		]),
		...mapGetters('LPdistrib', ['isWalletExcluded', 'getWalletShare', 'getWalletNeonOutput']),
		...mapGetters('utils', ['precise'])
	}
}
</script>