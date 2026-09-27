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
