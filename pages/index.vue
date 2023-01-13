<template>
  <div>
    <LoginModal />
    <MultiTxModal />
    <LPdistrib/>
    <notifications position="bottom right" classes="neonnotifications"/>
  </div>
</template>

<script>
import LoginModal from '~/components/modals/Login.vue'
import MultiTxModal from '~/components/modals/MultiTx.vue'

export default {
  name: 'IndexPage',
  layout: 'default',
  components: {
    LoginModal,
    MultiTxModal
  },
}
</script>
