<template>
  <div>
    <LoginModal />
    <LPdistrib/>
  </div>
</template>

<script>
import LoginModal from '~/components/modals/Login.vue'

export default {
  name: 'IndexPage',
  components: {
    LoginModal
  },
}
</script>
