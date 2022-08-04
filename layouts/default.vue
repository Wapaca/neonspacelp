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

</style>