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
    async searchPokemon(query, limit=20,offset=0) {
        try {
            if (!query || query.trim() === ''){
                return {result:[], total:0, limit, offset};
            };
            const searchQuery = query.toLowerCase().trim();
            const allPokemons = await this.getPokemons(1000,0);

            let filtered = [];

            const isIdQuery = /^\d+$/.test(searchQuery);

            //Búsqueda por ID
            if (isIdQuery) {
                console.log('Búsqueda por ID detectada');
                filtered = allPokemons.results.filter(pokemon => {
                    const urlParts = pokemon.url.split('/').filter(part => part !== '');
                    const pokemonId = urlParts[urlParts.length -1];
                    return pokemonId === searchQuery;
                });
                if(filtered.length === 0){
                    filtered = allPokemons.results.filter(pokemon => pokemon.name.includes(searchQuery));
                }
            } else {
                //Buscar por nombre (coincidencia parcial)
                filtered = allPokemons.results.filter(pokemon => pokemon.name.includes(searchQuery))
            }

            if(filtered.length === 0) {
                throw new Error(`No se encontraron Pokémon para "${searchQuery}"`)
            }

            filtered.sort((a,b) => {
                if(isIdQuery) {
                    const urlPartsA = a.url.split('/').filter(part => part !== '');
                    const urlPartsB = b.url.split('/').filter(part => part !== '');
                    const idA = urlPartsA[urlPartsA.length -1];
                    const idB = urlPartsB[urlPartsB.length -1];
                    if(idA === searchQuery && idB !== searchQuery) return -1;
                    if(idA !== searchQuery && idB === searchQuery) return 1;
                } 
                const aExact = a.name === searchQuery;
                const bExact = b.name === searchQuery;
                if (aExact && !bExact) return -1;
                if (!aExact && bExact) return 1;
                
                return a.name.localeCompare(b.name);}
            )
            const paginatedResults = filtered.slice(offset,offset+limit)
            const pokemonIds = paginatedResults.map(p=> {
                    const urlParts = p.url.split('/').filter(part => part !== '');
                    return urlParts[urlParts.length -1];
                });
            const results = await this.getMultiplePokemons(pokemonIds)
                return {
                    results, total: filtered.length, limit, offset
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