const POKEAPI_BASE_URL='https://pokeapi.co/api/v2';

async function fetchData(url) {
    try{
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); return data
    } catch(error) {
        console.error('Error fetching data: ',url, error);
        throw new Error(`No se puedo obtener datos: ${error.message}`);
    }
}

export const pokemonService = {
    async getPokemons(limit=20,offset=0) {
        const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
        return await fetchData(url)
    },
    async getPokemonDetails(idOrName) {
        const url = `${POKEAPI_BASE_URL}/pokemon/${idOrName}`;
        return await fetchData(url);
    },
    async getMultiplePokemons(ids) {
        try{
            const requests = ids.map(id => this.getPokemonDetails(id));
            const results= await Promise.allSettled(requests);
            return results.filter(result=> result.status === 'fulfilled').map(result => result.value)
        } catch (error) {
            console.error('Error fetching multiple pokemons: ', error);
            return []
        }
    },
    async searchPokemon(name, limit=20,offset=0) {
        try {
            if (!name || name.trim() === ''){
                return {result:[], total:0, limit, offset}
            };
            const searchName = name.toLowerCase().trim();
            try {
            const pokemon = await this.getPokemonDetails(searchName);
            return {
                result:[pokemon],
                total:1,
                limit,offset
            }
            } catch(exactError) {
                console.log(`Búsqueda exacta falló, intentando parcial: ${searchName}`);
                const allPokemons = await this.getPokemons(1000,0);
                const filtered = allPokemons.results.filter(pokemon => pokemon.name.includes(searchName));
                console.log(`Coincidencias encontradas: ${filtered.length}`);
                if(filtered.length === 0){
                    throw new Error(`No se encontraron Pokémon que contengan "${searchName}"`)
                }
                const paginatedResults = filtered.slice(offset,offset+limit)
                const pokemonIds = paginatedResults.map(p=> {
                    const urlParts = p.url.split('/').filter(part => part !== '');
                    return urlParts[urlParts.length -1];
                });
                const results = await this.getMultiplePokemons(pokemonIds)
                return {
                    results, total: filtered.length, limit, offset
                }
            }

        }catch(error){
            console.error('Error searching Pokemon: ', error);
            if(error.message.includes('404')|| error.message.includes('Not Found')) {
                throw new Error(`No se encontró el Pokémon "${name}"`)
            }
            throw new Error(`Error al buscar Pokémon: ${error.message}`);
        }
    },
    async getType(typeId) {
        const url = `${POKEAPI_BASE_URL}/type/${typeId}`;
        return await fetchData(url)
    },
    async getAbility(abilityId) {
        const url = `${POKEAPI_BASE_URL}/ability/${abilityId}`;
        return await fetchData(url)
    }
}