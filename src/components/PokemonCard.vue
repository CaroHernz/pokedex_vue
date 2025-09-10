<template>
    <div class="col-xs-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm border pokemon-card">
            <div class="card-img">
                <img 
                    :src="obtenerImagen(pokemon)"
                    :alt="pokemon.name"
                    class="card-img-top"
                    @error="handleImageError">
                    <div class="types-container mb-2">
                    <span
                    v-for="type in pokemon.types"
                    :key="type.slot"
                    class="badge type-badge"
                    :class="'type-' + type.type.name">
                    <i :class="obtenerIcono(type.type.name)"></i>{{ type.type.name }}
                </span>
                </div>
            </div>
            <div class="card-body text-center">
                <h4 class="card-title text-capitalize fw-bold">{{ pokemon.name }}</h4>
                <div class="stats-container">
          <div class="stat-item">
            <i class="fas fa-heart text-danger fa-2x"></i>
            <small>HP: {{ pokemon.stats[0].base_stat }}</small>
          </div>
          <div class="stat-item">
            <i class="fas fa-fist-raised text-warning fa-2x"></i>
            <small>ATK: {{ pokemon.stats[1].base_stat }}</small>
          </div>
          <div class="stat-item">
            <i class="fas fa-shield-alt text-info fa-2x"></i>
            <small>DEF: {{ pokemon.stats[2].base_stat }}</small>
          </div>
        </div>
      </div>
      <div class="card-footer bg-transparent border-0 p-0">
        <span class="pokemon-id bg-secondary rounded opacity-75">#{{ String(pokemon.id).padStart(3,'0') }}</span>
      </div>
            </div>
        </div>
</template>

<script>
export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
      validator:(value) => {
        return value && value.id && value.name;
      }
    }
  },
  methods: {
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/200x200/6c757d/ffffff?text=Pokémon';
    },
    obtenerImagen(pokemon) {
      return pokemon.sprites?.other?.['official-artwork']?.front_default || 
             pokemon.sprites?.front_default || 
             'https://via.placeholder.com/200x200/6c757d/ffffff?text=Pokémon';
    },
    obtenerIcono(tipo) {
      const iconos = {
        normal: 'fas fa-paw',
        fire: 'fas fa-fire',
        water: 'fas fa-droplet',
        electric: 'fas fa-bolt',
        grass: 'fas fa-leaf',
        ice: 'fas fa-snowflake',
        fighting: 'fas fa-fist-raised',
        poison: 'fas fa-skull',
        ground: 'fas fa-mountain',
        flying: 'fas fa-dove',
        psychic: 'fas fa-brain',
        bug: 'fas fa-bug',
        rock: 'fas fa-gem',
        ghost: 'fas fa-ghost',
        dragon: 'fas fa-dragon',
        dark: 'fas fa-moon',
        steel: 'fas fa-cog',
        fairy: 'fas fa-star'
      };
      
      return iconos[tipo] || 'fas fa-question-circle';
    }
  }
}
</script>

<style scoped>
.pokemon-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  border-radius: 15px;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-img-top-container {
  position: relative;
  padding: 20px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.pokemon-image {
  height: 150px;
  object-fit: contain;
}

.pokemon-id {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  padding: 2px 8px;
  font-size: 0.8rem;
}

.types-container {
  display: flex;
  position:absolute;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
  top:10px;
  left:10px
}

.type-badge {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.stat-item {
  background: #f8f9fa;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Colores para tipos de Pokémon */
.type-normal { background-color: #A8A878; color: white; }
.type-fire { background-color: #F08030; color: white; }
.type-water { background-color: #6890F0; color: white; }
.type-electric { background-color: #F8D030; color: white; }
.type-grass { background-color: #78C850; color: white; }
.type-ice { background-color: #98D8D8; color: white; }
.type-fighting { background-color: #C03028; color: white; }
.type-poison { background-color: #A040A0; color: white; }
.type-ground { background-color: #E0C068; color: white; }
.type-flying { background-color: #A890F0; color: white; }
.type-psychic { background-color: #F85888; color: white; }
.type-bug { background-color: #A8B820; color: white; }
.type-rock { background-color: #B8A038; color: white; }
.type-ghost { background-color: #705898; color: white; }
.type-dragon { background-color: #7038F8; color: white; }
.type-dark { background-color: #705848; color: white; }
.type-steel { background-color: #B8B8D0; color: white; }
.type-fairy { background-color: #EE99AC; color: white; }
</style>