async function init() {
  bindEvents();
  await loadMorePokemon();
}

function bindEvents() {
  loadMoreButton.addEventListener("click", loadMorePokemon);
  pokemonList.addEventListener("click", handleCardClick);
  pokemonDialog.addEventListener("click", handleDialogClick);
  pokemonDialog.addEventListener("close", unlockPage);
  searchForm.addEventListener("submit", handleSearch);
  searchInput.addEventListener("search", handleSearchClear);
  document.addEventListener("keydown", handleArrowKeys);
}

function handleSearchClear() {
  if (searchInput.value === "") resetSearch();
}

async function loadMorePokemon() {
  if (isLoading) return;
  setLoading(true);
  try { await fetchAndAppendPokemon(); }
  catch (error) { showError(error); }
  finally { setLoading(false); }
}

async function fetchAndAppendPokemon() {
  const remaining = APP_SETTINGS.maxPokemon - nextOffset;
  if (remaining <= 0) return;
  const batch = await getPokemonBatch(nextOffset, Math.min(APP_SETTINGS.pageSize, remaining));
  visiblePokemon.push(...batch);
  renderPokemon(batch, false);
  nextOffset += batch.length;
  loadMoreButton.hidden = nextOffset >= APP_SETTINGS.maxPokemon;
  announce(`${batch.length} Pokémon loaded.`);
}

function setLoading(state) {
  isLoading = state;
  loader.hidden = !state;
  loadMoreButton.disabled = state;
  loadMoreButton.textContent = state ? "Loading..." : "Load more Pokémon";
}

function handleCardClick(event) {
  const card = event.target.closest("[data-pokemon-id]");
  if (!card) return;
  activeIndex = visiblePokemon.findIndex(item => item.id === Number(card.dataset.pokemonId));
  openDialog();
}

async function openDialog() {
  const pokemon = visiblePokemon[activeIndex];
  if (!pokemon) return;
  if (!pokemonDialog.open) pokemonDialog.showModal();
  document.body.classList.add("dialog-open");
  await renderDialog(pokemon);
}

async function renderDialog(pokemon) {
  document.getElementById("dialogContent").innerHTML = getDialogLoadingTemplate(pokemon);
  try { await renderDialogDetails(pokemon); }
  catch (error) { showDialogError(error); }
}

async function renderDialogDetails(pokemon) {
  const chain = await getEvolutionChain(pokemon);
  const evolution = getEvolutionList(chain);
  document.getElementById("dialogContent").innerHTML = getDialogTemplate(pokemon, evolution);
}

function handleDialogClick(event) {
  if (event.target === pokemonDialog) return pokemonDialog.close();
  if (event.target.closest("[data-id='close-dialog-button']")) return pokemonDialog.close();
  const tab = event.target.closest("[data-dialog-tab]");
  if (tab) return switchDialogTab(tab.dataset.dialogTab);
  const button = event.target.closest("[data-direction]");
  if (button) navigateDialog(Number(button.dataset.direction));
}

function switchDialogTab(tabName) {
  document.querySelectorAll("[data-dialog-tab]").forEach(tab => setTabState(tab, tabName));
  document.querySelectorAll("[data-dialog-panel]").forEach(panel => setPanelState(panel, tabName));
}

function setTabState(tab, activeName) {
  const isActive = tab.dataset.dialogTab === activeName;
  tab.classList.toggle("active", isActive);
  tab.setAttribute("aria-selected", isActive);
}

function setPanelState(panel, activeName) {
  const isActive = panel.dataset.dialogPanel === activeName;
  panel.classList.toggle("active", isActive);
  panel.hidden = !isActive;
}

function navigateDialog(direction) {
  activeIndex = (activeIndex + direction + visiblePokemon.length) % visiblePokemon.length;
  openDialog();
}

function handleArrowKeys(event) {
  if (!pokemonDialog.open) return;
  if (event.key === "ArrowLeft") navigateDialog(-1);
  if (event.key === "ArrowRight") navigateDialog(1);
}

function unlockPage() {
  document.body.classList.remove("dialog-open");
}

async function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (query.length === 0) return resetSearch();
  if (query.length < APP_SETTINGS.minimumSearchLength) return showSearchHint();
  await searchPokemon(query);
}

async function searchPokemon(query) {
  setLoading(true);
  try { await fetchSearchResults(query); }
  catch (error) { showError(error); }
  finally { setLoading(false); }
}

async function fetchSearchResults(query) {
  const index = await getPokemonIndex();
  const matches = index.filter(item => item.name.includes(query)).slice(0, APP_SETTINGS.searchLimit);
  if (!matches.length) return renderNoResults();
  visiblePokemon = await Promise.all(matches.map(item => getPokemon(item.name)));
  renderPokemonList();
}

function renderPokemonList() {
  renderPokemon(visiblePokemon);
  loadMoreButton.hidden = true;
  announce(`${visiblePokemon.length} matching Pokémon found.`);
}

function renderPokemon(pokemon, replace = true) {
  const cards = pokemon.map(getCardTemplate).join("");
  if (replace) pokemonList.innerHTML = cards;
  else pokemonList.insertAdjacentHTML("beforeend", cards);
}

function renderNoResults() {
  visiblePokemon = [];
  pokemonList.innerHTML = getNotFoundTemplate();
  loadMoreButton.hidden = true;
  announce("No matching Pokémon found.");
}

function resetSearch() {
  visiblePokemon = [];
  pokemonList.innerHTML = "";
  nextOffset = 0;
  loadMoreButton.hidden = false;
  loadMorePokemon();
}

function showSearchHint() {
  announce("Please enter at least 3 letters.");
  searchInput.focus();
}

function announce(message) {
  statusBox.textContent = message;
  window.setTimeout(() => statusBox.textContent = "", 3500);
}

function showError(error) {
  console.error(error);
  statusBox.textContent = "Something went wrong. Please check your connection and try again.";
}

function showDialogError(error) {
  console.error(error);
  document.getElementById("dialogContent").innerHTML = getDialogErrorTemplate();
}

init();
