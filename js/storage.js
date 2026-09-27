const pokemonCache = new Map();
const speciesCache = new Map();
const evolutionCache = new Map();
let pokemonIndexCache = null;

function getCachedPokemon(identifier) {
  return pokemonCache.get(String(identifier).toLowerCase());
}

function storePokemon(pokemon) {
  pokemonCache.set(String(pokemon.id), pokemon);
  pokemonCache.set(pokemon.name, pokemon);
}

function getCachedSpecies(id) {
  return speciesCache.get(id);
}

function storeSpecies(id, species) {
  speciesCache.set(id, species);
}

function getCachedEvolution(id) {
  return evolutionCache.get(id);
}

function storeEvolution(id, chain) {
  evolutionCache.set(id, chain);
}

function getCachedPokemonIndex() {
  return pokemonIndexCache;
}

function storePokemonIndex(index) {
  pokemonIndexCache = index;
}
