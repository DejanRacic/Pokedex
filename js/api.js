async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

async function getPokemon(identifier) {
  const key = String(identifier).toLowerCase();
  const cachedPokemon = getCachedPokemon(key);
  if (cachedPokemon) return cachedPokemon;
  const data = await fetchJson(`${APP_SETTINGS.apiUrl}/pokemon/${key}`);
  storePokemon(data);
  return data;
}

async function getPokemonBatch(offset, limit) {
  const endpoint = `${APP_SETTINGS.apiUrl}/pokemon?offset=${offset}&limit=${limit}`;
  const list = await fetchJson(endpoint);
  return Promise.all(list.results.map(item => getPokemon(item.name)));
}

async function getPokemonIndex() {
  const cachedIndex = getCachedPokemonIndex();
  if (cachedIndex) return cachedIndex;
  const data = await fetchJson(`${APP_SETTINGS.apiUrl}/pokemon?limit=${APP_SETTINGS.maxPokemon}`);
  storePokemonIndex(data.results);
  return data.results;
}

async function getSpecies(pokemon) {
  const cachedSpecies = getCachedSpecies(pokemon.id);
  if (cachedSpecies) return cachedSpecies;
  const data = await fetchJson(pokemon.species.url);
  storeSpecies(pokemon.id, data);
  return data;
}

async function getEvolutionChain(pokemon) {
  const cachedEvolution = getCachedEvolution(pokemon.id);
  if (cachedEvolution) return cachedEvolution;
  const species = await getSpecies(pokemon);
  const data = await fetchJson(species.evolution_chain.url);
  storeEvolution(pokemon.id, data.chain);
  return data.chain;
}
