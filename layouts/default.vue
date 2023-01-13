<template>
	<div class="waxApp">
		<Nuxt />
	</div>
</template>

<script>
export default {
	created() {
		this.unsubscribe = this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'chain/setLastWallet') {
				localStorage.setItem("lastWallet", state.chain.lastWallet)
			}
		});
	}
}
</script>

<style>
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    text-align: center;
  }
  .modal-layerclose {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
  }
  .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    padding: 0 30px;
    background: rgba(0, 0, 0, 0.8);
    z-index: 201;
    border: 5px solid #ff00ec;
    animation: boxPinkPulsate 1.5s infinite alternate;
  }
  .modal-content .modal-xmark {
    display: inline-block;
    font-size: 30px;
    position: absolute;
    right: 40px;
    top: 15px;
    padding: 0 5px;
    transition: 0.2s;
    cursor: pointer;
  }
  .modal-content h2 {
    color: #fff;
    animation: neonPinkPulsate 2.5s infinite alternate; 
  }
</style>