<template>
  <div v-if="visible && current === 'login'" class="modal-container">
    <div class="modal-layerclose" @click="close"></div>
    <div class="modal-content">
      <div class="modal-xmark neon-button"><fa-icon @click="close" :icon="['fas','xmark']" /></div>
      <h2>Select wallet</h2>
      <ul class="items">
        <li v-for="wallet in wallets">
          <div class="item">
            <button class="neon-button" @click='login(wallet.id)'>
              <img :src="wallet.logo" :alt="wallet.name + 'logo'" />
              <span>{{wallet.name}}</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      loading: false,

      wallets: []
    }
  },

  computed: {
    ...mapState('modal', ['current', 'visible'])
  },

  mounted() {
    const wallets = [
      {
        id: 'wcw',
        name: 'Wax Cloud Wallet',
        logo: require('@/static/logos/wax.svg'),
        index: 'wax',
        create: 'https://all-access.wax.io/'
      },
      {
        id: 'anchor',
        name: 'Anchor',
        logo: require('@/static/logos/anchor.svg'),
        create: 'https://greymass.com/en/anchor/'
      },
      {
        id: 'scatter',
        name: 'Scatter / TP / Starteos',
        logo: require('@/static/logos/scatter.svg'),
        create:
          'https://github.com/GetScatter/ScatterDesktop/releases/tag/11.0.1'
      },
      {
        id: 'scatter',
        name: 'Wombat',
        logo: require('@/static/logos/wombat.png'),
        create: 'https://www.wombat.app/the-app'
      }
    ]

    this.wallets = wallets
  },

  methods: {
    async login(provider) {
      this.loading = true

      try {
        await this.$store.dispatch('chain/login', provider)
        this.$store.dispatch('modal/closeModal')
      } catch (e) {
        console.warn('login error')
        console.log(e)
        /* this.$notify({
          title: `${provider} login error`,
          message: e,
          type: 'error'
        }) */
      } finally {
        this.loading = false
      }
    },
    close() {
      this.$store.dispatch('modal/closeModal')
    }
  }
}
</script>

<style scoped>
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
  .modal-content ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-bottom: 20px;
  }
  .modal-content ul li {
    display: inline-block;
    width: 50%;
    vertical-align: top;
  }
  .modal-content ul li .item {
    padding: 10px;
  }
  .modal-content ul li .item button {
    width: 100%;
    height: 50px;
    border-radius: 0;
    display: flex;
    justify-content: left;
  }
  .modal-content ul li .item button img {
    max-width: 40px;
    max-height: 40px;
    margin-right: 20px;
  }
  @media (max-width: 768px) {
    .modal-content ul li {
      display: block;
      margin: 0 auto;
      width: 90%;
    }
  }
</style>
