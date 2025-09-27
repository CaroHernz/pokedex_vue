<template>
  <div class="pokemon-page rounded-pill shadow-sm">
    <!-- Header y buscador -->
    <div class="container-fluid rounded-pill pokemon-header text-white py-4 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="text-center">
            <h1 class="fw-bold mb-0">
              <i class="fas fa-gamepad"></i> Pokédex .·
            </h1>
          </div>
          <div class="text-end">
            <DarkModeToggle />
          </div>
        </div>

        <div class="row justify-content-center mt-4">
          <div class="col-md-8 col-10">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control shadow-none border-0" 
                placeholder="Buscar Pokémon por nombre..."
                v-model.lazy="busqueda"
                @input="onBusquedaChange"
                @keyup.enter="realizarBusqueda"
              >
              <button class="btn btn-search" @click="realizarBusqueda">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  <div class="pokemon-page rounded-5 shadow-sm">
    <!-- Contenido principal -->
    <div class="container pt-5 pb-4 px-5">
      <!-- Loader -->
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3">Cargando Pokémon...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger text-center">
        <i class="fas fa-exclamation-triangle"></i> 
        {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-3" @click="cargarPokemones">
          Reintentar
        </button>
      </div>

      <!-- Mensaje de no resultados -->
      <div v-else-if="busqueda && pokemones.length === 0" class="text-center py-5">
        <i class="fas fa-question-circle" style="font-size: 3rem;"></i>
        <h4 class="mt-3">No se encontraron Pokémon</h4>
        <p>No hay resultados para "{{ busqueda }}"</p>
        <button class="btn btn-primary" @click="limpiarBusqueda">
          Ver todos los Pokémon
        </button>
      </div>

      <!-- Grid de Pokémon -->
      <div v-else-if="pokemones && pokemones.length > 0" class="row">
        <PokemonCard 
          v-for="pokemon in pokemones" 
          :key="pokemon.id || pokemon.name"
          :pokemon="pokemon"
        />
      </div>

      <!-- Mensaje inicial -->
      <div v-else class="text-center py-5">
        <i class="fas fa-search" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Busca Pokémon</h4>
        <p>Usa el buscador para encontrar Pokémon</p>
      </div>

      <!-- Paginación -->
      <div v-if="pokemones.length > 0 && totalPaginas >1" class="d-flex justify-content-center mt-3">
        <nav aria-label="Pokémon pagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: paginaActual === 1 }">
              <button class="page-link" @click="cambiarPagina(paginaActual-1)">
                <i class="fas fa-chevron-left"></i> Anterior
              </button>
            </li>
            <li v-for="page in paginasMostradas" :key="page" class="page-item" :class="{ active: page === paginaActual }">
              <button class="page-link" @click="cambiarPagina(page)">{{ page }}</button>
              </li>
            <li class="page-item" :class="{disabled:paginaActual === totalPaginas}">
              <button class="page-link" @click="cambiarPagina(paginaActual+1)">
                Siguiente <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { pokemonService } from '../services/pokeapi';
import PokemonCard from '@/components/PokemonCard.vue';
import DarkModeToggle from '../components/Toggle.vue';
import { useThemeStore } from '../stores/themeStore';

export default {
  name: 'PokemonPage',
  components: {
    PokemonCard,
    DarkModeToggle
  },
  data() {
    return {
      busqueda: '',
      pokemones: [],
      cargando: false,
      error: null,
      offset: 0,
      limit: 20,
      paginaActual: 1,
      totalResultados:0,
      busquedaTimeout: null
    }
  },
  computed:{
    totalPaginas() {
      return Math.ceil(this.totalResultados/this.limit)
    },
    paginasMostradas(){
      const pages = [];
      const maxPages = 5;
      let startPage = Math.max(1,this.paginaActual-Math.floor(maxPages/2));
      let endPage = Math.min(this.totalPaginas, startPage + maxPages -1);
      if(endPage-startPage +1 < maxPages) {
        startPage = Math.max(1,endPage-maxPages+1)
      }
      for (let i = startPage; i <=endPage; i++){
        pages.push(i)
      }
      return pages;
    },
    isDarkMode() {
      const themeStore = useThemeStore();
      return themeStore.initializeTheme();
    }
  },
  async mounted() {
    const themeStore = useThemeStore();
    themeStore.initializeTheme();
    await this.cargarPokemones();
  },
  methods: {
    async cargarPokemones() {
      this.cargando = true;
      this.error = null;
      
      try {
        console.log('Cargando pokémon...');
        
        if (this.busqueda && this.busqueda.trim() !== '') {
          // Búsqueda por nombre
          const resultado = await pokemonService.searchPokemon(this.busqueda, this.limit, this.offset);
          this.pokemones = Array.isArray(resultado.results) ? resultado.results : [];
          this.totalResultados = resultado.total || 0;
          console.log('Resultado de búsqueda: ', resultado);
          console.log('Pokémones procesados: ', this.pokemones)

          if (this.pokemones.length === 0 && this.busqueda.trim() !== '') {
            this.error = `No se encontraron Pokémon que contengan "${this.busqueda}"`
          }
        } else {
          // Carga normal con paginación
          const response = await pokemonService.getPokemons(this.limit, this.offset);
          
          if (response && response.results) {
            const pokemonIds = response.results
              .filter(p => p.url)
              .map(p => {
                const urlParts = p.url.split('/').filter(part => part !== '');
                return urlParts[urlParts.length - 1];
              });
            
            if (pokemonIds.length > 0) {
              this.pokemones = await pokemonService.getMultiplePokemons(pokemonIds);
              this.totalResultados = response.count;
            } else {
              this.pokemones = [];
              this.totalResultados=0;
            }
          } else {
            this.pokemones = [];
            this.totalResultados=0;
          }
        }
        console.log('Pokémones cargados:', this.pokemones);
        console.log('Total resultados: ', this.totalResultados)
      } catch (error) {
        this.error = error.message || 'Error al cargar los Pokémon. Por favor, intenta nuevamente.';
        console.error('Error:', error);
      } finally {
        this.cargando = false;
      }
    },
    cambiarPagina(nuevaPagina) {
      if(nuevaPagina <1 || nuevaPagina > this.totalPaginas) return;
        this.paginaActual = nuevaPagina;
        this.offset = (nuevaPagina -1) * this.limit;
        this.cargarPokemones();
        window.scrollTo(0,0)
    },
    onBusquedaChange() {
      //Reiniciar paginacion cuando cambia la búsqueda
      this.offset=0;
      this.paginaActual =1;
      // Debounce para evitar muchas peticiones
      clearTimeout(this.busquedaTimeout);
      this.busquedaTimeout = setTimeout(() => {
        if (this.busqueda.length >= 2 || this.busqueda.length === 0) {
          this.realizarBusqueda();
        }
      }, 500);
    },

    realizarBusqueda() {
      this.cargarPokemones();
    },

    limpiarBusqueda() {
      this.busqueda = '';
      this.offset=0;
      this.paginaActual=1;
      this.cargarPokemones();
    }
  }
}
</script>

<style scoped>

</style>