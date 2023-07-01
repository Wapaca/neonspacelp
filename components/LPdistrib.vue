<template>
  <div class="LPdistrib">
    <img class="LPdistrib-logo" src="/neonspace_logo.png" alt="NeonSpace Logo"/>
    <div class="exchanges-container">
      <ul class="exchanges">
        <li @click="changeExchange('alcor')" :class="getExchangeClass('alcor')">Alcor</li>
        <li @click="changeExchange('defibox')" :class="getExchangeClass('defibox')">Defibox</li>
        <li @click="changeExchange('taco')" :class="getExchangeClass('taco')">Taco</li>
      </ul>
    </div>
    <div class="excludewallet-container">
      <button @click="switchExcludeWallets()" :class="'neon-button ' + getExcludeWalletsClass()">Exclude wallets</button>
    </div>
    <HoldersUniswapv2 v-if="!isLPLoading && poolType === 'uniswap-v2'" />
    <HoldersUniswapv3 v-else-if="!isLPLoading && poolType === 'uniswap-v3'" />
    <div v-else>
      <ClipLoader color="#ff00ec"/>
    </div>
    <div class="sendDistrib">
      <div v-if="user !== null">
        <div><button @click='sendRewards()' class="neon-button">Send all rewards</button></div>
        <div><button @click='logout()' class="neon-button">Logout</button></div>
      </div>
      <div v-else>
        <button @click='$store.dispatch("modal/login")' class="neon-button">Connect wallet</button>
      </div>
    </div>
    <div class="credits">
      <span>App made by <a href="https://twitter.com/wapaca" target="_blank">Wapaca</a></span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  methods: {
    getExcludeWalletsClass() {
      return (this.excludeWalletActive) ? 'active' : ''
    },
    getExchangeClass(exchange) {
      return (exchange === this.exchange) ? 'active' : ''
    },
    ...mapActions('chain', ['logout']),
    ...mapActions('LPdistrib', ['switchExcludeWallets', 'sendRewards', 'fetchTopLP', 'setExcludedWallets', 'changeExchange'])
  },
  computed: {
    ...mapState(['user']),
    ...mapState('LPdistrib', ['excludeWalletActive', 'exchange', 'isLPLoading', 'poolType']),
  },
  components: {
    ClipLoader
  },
  mounted() {
    if(!process.client) {
      console.log('!process.client')
      return;
    }

    let savedData = localStorage.getItem("excludedWallets");
    if(savedData) {
      savedData = JSON.parse(savedData)
      this.setExcludedWallets(savedData)
      this.fetchTopLP()
    }
    else {
      this.fetchTopLP()
    }

  },
  created() {
   this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (['LPdistrib/addExcludedWallets', 'LPdistrib/remExcludedWallets'].indexOf(mutation.type) !== -1 ) {
        localStorage.setItem("excludedWallets", JSON.stringify(state.LPdistrib.excludedWallets) )
      }
   });
  }
}
</script>

<style>
@font-face {
    font-family: 'Vibur';
    src: url('/fonts/Vibur/Vibur.eot');
    src: url('/fonts/Vibur/Vibur.eot?#iefix') format('embedded-opentype'),
        url('/fonts/Vibur/Vibur.woff2') format('woff2'),
        url('/fonts/Vibur/Vibur.woff') format('woff'),
        url('/fonts/Vibur/Vibur.ttf') format('truetype'),
        url('/fonts/Vibur/Vibur.svg#Vibur') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
@keyframes neonPinkFlicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
      text-shadow:
      0 0 4px #ff00ec,
      0 0 11px #ff00ec,
      0 0 19px #ff00ec,
      0 0 40px #ff00ec,
      0 0 80px #ff00ec,
      0 0 90px #ff00ec,
      0 0 100px #ff00ec,
      0 0 150px #ff00ec;
  }
  
  20%, 24%, 55% {        
      text-shadow: none;
  }    
}
@keyframes neonPinkPulsate {
  100% {
    text-shadow:
      0 0 4px #ff00ec,
      0 0 11px #ff00ec,
      0 0 19px #ff00ec,
      0 0 40px #ff00ec,
      0 0 80px #ff00ec,
      0 0 90px #ff00ec,
      0 0 100px #ff00ec,
      0 0 150px #ff00ec;
  }
  0% {
    text-shadow:
      0 0 2px #ff00ec,
      0 0 4px #ff00ec,
      0 0 6px #ff00ec,
      0 0 10px #ff00ec,
      0 0 45px #ff00ec,
      0 0 55px #ff00ec,
      0 0 70px #ff00ec,
      0 0 80px #ff00ec;
  }
}
@keyframes boxPinkPulsate {
  100% {
    box-shadow: 0 0 35px 0 #ff00ec;
  }
  0% {
    box-shadow: 0 0 25px 0 #ff00ec;
  }
}
.vue-notification-template.neonnotifications {
  color: #fff;
  font-size: 20px;
  background: #292929;
  padding: 10px;
}
.vue-notification-template.neonnotifications .notification-title {
  animation: neonPinkPulsate 2.5s infinite alternate;
}
.vue-notification-template.neonnotifications.success {
  background: #66a663;
}
.vue-notification-template.neonnotifications.warning {
  background: #ca8744;
}
.vue-notification-template.neonnotifications.error {
  background: #ca4444;
}
.vue-notification-template.neonnotifications .notification-content {
  line-break: anywhere;
}
.vue-notification-template.neonnotifications .notification-content a {
  text-decoration: underline;
  color: #fff;
}
html, body, #__nuxt {
  height: 100%;
  min-height:100%;
  position:relative;
}
body {
  background-image: url('/background.jpg');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;

  text-align: center;
  color: #00f3ff;
  font-family: 'Vibur';
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.neon-button {
  background: transparent;
  border: 3px solid #ff00ec;
  animation: boxPinkPulsate 1.5s infinite alternate;
  border-radius: 20%;
  padding: 5px 10px;
  text-align: center;
  font-family: 'Vibur';
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  transition: 0.2s;
  cursor: pointer;
}
.neon-button:hover,
.neon-button.active {
  animation: neonPinkPulsate 2.5s infinite alternate,
             boxPinkPulsate 1.5s infinite alternate;
}
.LPdistrib {
  position: relative;
  background: rgba(0, 0, 0, 0.6);
  display:inline-block;
  width: 80%;
  border: 5px solid #ff00ec;
  animation: boxPinkPulsate 1.5s infinite alternate;
  border-radius: 45px;
  margin-top: 70px;
  padding: 92px 10px 23px;
}
.LPdistrib .LPdistrib-logo {
  position: absolute;
  top: -92px;
  left: 50%;
  transform: translateX(-50%);

  max-width: 185px;
}
.excludewallet-container {
  display:inline-block;
  position: absolute;
  top: 12px;
  right: 10%;
  transform: translateX(10%);
}
.exchanges {
  position: absolute;
  top: 12px;
  left: 10%;
  transform: translateX(-10%);
  display: inline-block;
}
.exchanges li {
  display: inline-block;
  cursor: pointer;
  font-weight: bold;
  font-size: 28px;
  padding: 0 10px;
  color: #c5c5c5;
}
.exchanges li.active {
  color: #fff;
  animation: neonPinkFlicker 1.5s infinite alternate;
}

.holders li.head .cell,
.holders li.foot .cell {
  color: #fff;
  animation: neonPinkPulsate 2.5s infinite alternate; 
  font-size: 24px;
}
.holders li {
  display: flex;
  justify-content: space-between;
}
.holders li.body.uniswapv3 {
  margin-bottom: 0.4em;
  padding-bottom: 0.4em;
  border-bottom: 1px solid #00f3ff;
}
.holders li.foot {
  margin-top: 1em;
}
.holders .cell {
  text-align: center;
  width: 20%;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.holders .cell.liquidity {
  flex-direction: column;
}
.holders .cell.liquidity .fa-check { color: #09eb37; }
.holders .cell.liquidity .fa-xmark { color: #eb0924; }
.holders .doublecell {
  width: 40%;
}
.holders.exclude li.head .cell,
.holders.exclude li.body .cell {
  width: 18%;
}
.holders.exclude .doublecell {
  width: 60%;
}
.holders .excludeCell {
  display: none;
}
.holders.exclude .excludeCell {
  display: flex;
}
.holders .cell input[type=number] {
  background: transparent;
  border: 3px solid #ff00ec;
  border-radius: 20%;
  padding: 5px 10px;
  text-align: center;
  font-family: 'Vibur';
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  transition: 0.2s;
  animation: boxPinkPulsate 1.5s infinite alternate,
             neonPinkPulsate 2.5s infinite alternate;
}
.holders .cell input[type=number]:focus{
    outline: none;
}
.excludeButton {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15px;
  width: 15px;
  border: 3px solid #ff00ec;
  animation: boxPinkPulsate 1.5s infinite alternate;
  cursor: pointer;
}
.excludeButton span {
  font-size: 16px;
}
.sendDistrib {
  margin-top: 1em;
}
.sendDistrib button {
  margin-bottom: 0.8em;
}
.credits {
  font-size: 20px;
  margin-top: 1em;
}
.credits a {
  color: #fff;
  animation: neonPinkFlicker 1.5s infinite alternate;
  text-decoration: none;
}
.credits a:hover {
  animation: neonPinkPulsate 2.5s infinite alternate;
}
</style>
