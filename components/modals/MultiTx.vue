<template>
  <div v-if="visible && current === 'MultiTx'" class="modal-container multitx">
    <div class="modal-layerclose" @click="close"></div>
    <div class="modal-content">
      <div class="modal-xmark neon-button"><fa-icon @click="close" :icon="['fas','xmark']" /></div>
      <h2>Sign transactions</h2>
      <p>Please sign several transactions</p>
      <ul>
      	<li @click="sendTx(i)" v-for="(acts, i) in actions">
      		<span>Transaction {{ i + 1 }}</span>
      		<div v-if="results[i] === 'loading'"><ClipLoader color="#ff00ec"/></div>
      		<div v-else-if="results[i] === 'sent'"><fa-icon :icon="['fas','check']" /></div>
      		<button v-else class="neon-button">Sign</button>
      	</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  components: {
		ClipLoader
  },


  computed: {
    ...mapState('modal', ['current', 'visible']),
    ...mapState('MultiTx', ['actions', 'results']),
  },

  mounted() {

  },

  methods: {
    close() {
      this.$store.dispatch('modal/closeModal')
    },
    ...mapActions('MultiTx', ['sendTx'])
  }
}
</script>
<style scoped>
.modal-content ul {
	margin-top: 1em;
}
.modal-content ul li {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 0.5em;
}
.modal-content ul li div {
	width: 52px;
	height: 42px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.modal-content ul li .svg-inline--fa {
	color: #ff00ec;
}
</style>