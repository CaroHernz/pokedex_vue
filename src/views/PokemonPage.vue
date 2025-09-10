<template>
  <div class="pokemon-page rounded-pill shadow-sm">
    <!-- Header y buscador -->
    <div class="container-fluid rounded-pill bg-warning bg-opacity-75 text-white py-4 mb-4">
      <div class="container">
        <h1 class="text-center fw-bold">
          <i class="fas fa-gamepad"></i> Pokédex .·
        </h1>
        
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
              <button class="btn btn-light" @click="realizarBusqueda">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="pokemon-page rounded shadow-sm">
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

export default {
  name: 'PokemonPage',
  components: {
    PokemonCard
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
    }
  },
  async mounted() {
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
.pokemon-page {
  background-color: white;
}
.page-link {
  color:#fd7e14;
  background-color: transparent;
  transition:all 0.3s ease;
}
.page-link:hover {
  color:white;
  background-color: #ffcd2a;
}
.page-link:focus {
  color:#fd7e14;
  background-color: #fff3cd;
}
.page-item.active .page-link {
  color: white;
  background-color: #fd7e14;
  border-color: transparent;
  scale: 1.01;
  border-radius: 3px;
}
.page-item.active .page-link:hover{
  background-color: #fd7e14;
  border-color: transparent;
  color: white;
  
}
.page-item.disabled .page-link {
  color: #6c757d; /* Gris para deshabilitado */
  background-color: transparent;
  border-color: #dee2e6;
}

.page-item.disabled .page-link:hover {
  color: #6c757d;
  background-color: transparent;
  border-color: #dee2e6;
}
.pagination {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
}

.page-item:first-child .page-link {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.page-item:last-child .page-link {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
</style>