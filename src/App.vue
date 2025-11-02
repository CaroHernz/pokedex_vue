<template>
  <div id="app">    
    <main class="container mt-4">
      <PokemonPage />
      <Footer />
    </main>
  </div>
</template>

<script>
import PokemonPage from './views/PokemonPage.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components:{
    PokemonPage,
    Footer
  }
}
</script>
<style scoped>

</style>
