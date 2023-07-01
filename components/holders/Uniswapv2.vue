<template>
<ul :class="'holders '+((excludeWalletActive) ? 'exclude' : '')">
  <li class="head">
    <div class="cell excludeCell">Exclude</div>
    <div class="cell">Rank</div>
    <div class="cell">Wallet</div>
    <div class="cell">LP token amount</div>
    <div class="cell">Share</div>
    <div class="cell">NEON reward</div>
  </li>
  <li class="body" v-for="(holder, i) in displayedTopLP">
    <div class="cell excludeCell">
      <div class="excludeButton" v-if="isWalletExcluded(holder[0])" @click="remExcludeWallet(holder[0])"><span><fa-icon :icon="['fas','check']" /></span></div>
      <div class="excludeButton" v-else @click="addExcludeWallet(holder[0])"></div>
    </div>
    <div class="cell">#{{1+i}}</div>
    <div class="cell">{{holder[0]}}</div>
    <div class="cell">{{holder[1]}}</div>
    <div class="cell">{{ precise(getWalletShare(holder[0]), 2) }}%</div>
    <div class="cell">{{ precise(getWalletNeonOutput(holder[0]), 4) }}</div>
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
			'switchExcludeWallets',
			'remExcludeWallet',
			'addExcludeWallet'
		])
	},
	computed: {
		...mapState('LPdistrib', [
			'excludeWalletActive',
			'displayedTopLP',
			'totalNeonReward',
			'totalLPamount'
		]),
		...mapGetters('LPdistrib', ['isWalletExcluded', 'getWalletShare', 'getWalletNeonOutput']),
		...mapGetters('utils', ['precise'])
	}
}
</script>