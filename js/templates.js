function getCardTemplate(pokemon) {
  return `<li>${getCardButton(pokemon)}</li>`;
}

function getCardButton(pokemon) {
  return `<button class="pokemon-card type-${pokemon.types[0].type.name}" data-id="card" data-pokemon-id="${pokemon.id}" aria-label="Open details for ${formatName(pokemon.name)}">
    <span class="card-heading"><b>#${pokemon.id}</b><strong>${formatName(pokemon.name)}</strong></span>
    <span class="card-art"><img data-id="card-image" src="${getArtwork(pokemon)}" alt="${formatName(pokemon.name)}" loading="lazy" width="190" height="190"></span>
    <span class="card-types">${pokemon.types.map(item => getTypeIconTemplate(item.type.name)).join("")}</span>
  </button>`;
}

function getTypeIconTemplate(type) {
  return `<span class="type-icon" style="--icon-color:${POKEMON_TYPE_DATA[type].color}" title="${formatName(type)} type" aria-label="${formatName(type)} type">${POKEMON_TYPE_DATA[type].icon}</span>`;
}

function getTypeTemplate(type) {
  return `<span class="type-badge" style="--type-color:${POKEMON_TYPE_DATA[type].color}">${formatName(type)}</span>`;
}

function getDialogTemplate(pokemon, evolutionNames) {
  return `<article class="dialog-card type-${pokemon.types[0].type.name}" data-id="overlay-pokemon-name">
    ${getDialogHeader(pokemon)}${getDialogHero(pokemon)}${getDialogTabs()}${getDialogPanels(pokemon, evolutionNames)}${getDialogNavigation(pokemon)}
  </article>`;
}

function getDialogHeader(pokemon) {
  return `<button class="dialog-close" data-id="close-dialog-button" aria-label="Close Pokémon details">×</button>
    <div class="dialog-heading"><span>#${String(pokemon.id).padStart(4, "0")}</span><h2>${formatName(pokemon.name)}</h2>
    <div class="types">${pokemon.types.map(item => getTypeTemplate(item.type.name)).join("")}</div></div>`;
}

function getDialogHero(pokemon) {
  return `<div class="dialog-hero"><img data-id="dialog-image" src="${getArtwork(pokemon)}" alt="${formatName(pokemon.name)}" width="300" height="300"></div>
    <div class="dialog-type-icons">${pokemon.types.map(item => getTypeIconTemplate(item.type.name)).join("")}</div>`;
}

function getDialogTabs() {
  return `<div class="dialog-tabs" role="tablist" aria-label="Pokémon information">
    <button class="active" role="tab" aria-label="Show main information" aria-selected="true" data-dialog-tab="main">Main</button>
    <button role="tab" aria-label="Show base stats" aria-selected="false" data-dialog-tab="stats">Stats</button>
    <button role="tab" aria-label="Show evolution chain" aria-selected="false" data-dialog-tab="evolution">Evolution Chain</button></div>`;
}

function getDialogPanels(pokemon, evolutionNames) {
  return `<div class="dialog-panels">${getMainPanel(pokemon)}${getStatsPanel(pokemon)}${getEvolutionPanel(evolutionNames)}</div>`;
}

function getMainPanel(pokemon) {
  return `<section class="dialog-panel active" data-dialog-panel="main" role="tabpanel"><dl class="main-facts">
    <div><dt>Height</dt><dd>${pokemon.height / 10} m</dd></div><div><dt>Weight</dt><dd>${pokemon.weight / 10} kg</dd></div>
    <div><dt>Base experience</dt><dd>${pokemon.base_experience ?? "-"}</dd></div><div><dt>Abilities</dt><dd>${pokemon.abilities.map(item => formatName(item.ability.name)).join(", ")}</dd></div>
    <div><dt>Types</dt><dd>${pokemon.types.map(item => formatName(item.type.name)).join(", ")}</dd></div></dl></section>`;
}

function getStatsPanel(pokemon) {
  return `<section class="dialog-panel" data-dialog-panel="stats" role="tabpanel" hidden><div class="stats-details">
    <div class="stats">${pokemon.stats.map(getStatTemplate).join("")}</div></div></section>`;
}

function getEvolutionPanel(evolutionNames) {
  return `<section class="dialog-panel" data-dialog-panel="evolution" role="tabpanel" hidden>
    <div class="evolution-chain">${evolutionNames.map(getEvolutionStep).join('<span class="evolution-arrow">»</span>')}</div></section>`;
}

function getEvolutionStep(item) {
  return `<div class="evolution-step"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png" alt="${formatName(item.name)}" loading="lazy">
    <span>${formatName(item.name)}</span></div>`;
}

function getStatTemplate(item) {
  return `<div class="stat"><span>${getStatData(item).label}</span><b>${item.base_stat}</b><i><em style="width:${getStatData(item).width}%"></em></i></div>`;
}

function getDialogNavigation(pokemon) {
  return `<div class="dialog-nav"><button data-id="prev-button" aria-label="Previous Pokémon" data-direction="-1">← Previous</button>
    <span>${formatName(pokemon.name)}</span><button data-id="next-button" aria-label="Next Pokémon" data-direction="1">Next →</button></div>`;
}

function getNotFoundTemplate() {
  return `<p class="not-found" data-id="not-found">No matching Pokémon found. Try another name.</p>`;
}

function getDialogLoadingTemplate(pokemon) {
  return `<div class="dialog-loading"><img src="assets/img/pokeball.svg" alt="" width="56" height="56"><p>Loading ${formatName(pokemon.name)}...</p></div>`;
}

function getDialogErrorTemplate() {
  return `<div class="dialog-loading"><p>Details could not be loaded.</p></div>`;
}
