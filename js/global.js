const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonDialog = document.getElementById("pokemonDialog");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const statusBox = document.getElementById("status");

let visiblePokemon = [];
let nextOffset = 0;
let activeIndex = 0;
let isLoading = false;

function formatName(name) {
  return name.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function getArtwork(pokemon) {
  return pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
}

function getStatData(item) {
  return {
    label: formatName(item.stat.name).replace("Special", "Sp."),
    width: Math.min(item.base_stat / 2, 100)
  };
}
