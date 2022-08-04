<template>
  <div>
    <LoginModal />
    <LPdistrib/>
    <notifications position="bottom right" classes="neonnotifications"/>
  </div>
</template>

<script>
import LoginModal from '~/components/modals/Login.vue'

export default {
  name: 'IndexPage',
  layout: 'default',
  components: {
    LoginModal
  },
}
</script>
