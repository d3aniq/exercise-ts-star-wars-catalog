// Om du INTE har <link ...> i index.html, importera css här:
import "../styles.css";

import { getCharacters, getHomeworld, searchCharacters } from "./api/swapi";
import { renderList, renderCharacter, renderPlanet, showLoader } from "./ui/render";
import type { Character } from "./types";

const listEl = document.getElementById("list")!;
const charEl = document.getElementById("character")!;
const planetEl = document.getElementById("homeworld")!;
const searchInput = document.getElementById("search") as HTMLInputElement | null;

let currentPage = 1;
let currentQuery = ""; // tomt = vanlig listning

function debounce<T extends (...a: any[]) => void>(fn: T, ms = 300) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

async function loadPage(page: number) {
  currentPage = Math.max(1, page);
  showLoader(listEl);

  //const fetcher = currentQuery ? searchCharacters : getCharacters;
  //const { items, next, prev } = await fetcher(currentQuery, currentPage);

  const { items, next, prev } = currentQuery
  ? await searchCharacters(currentQuery, currentPage)
  : await getCharacters(currentPage);

  renderList(listEl, items, pickCharacter, currentPage, prev, next, loadPage);
  if (items[0]) pickCharacter(items[0]);
}

async function pickCharacter(c: Character) {
  showLoader(charEl);
  showLoader(planetEl);

  renderCharacter(charEl, c);
  const planet = await getHomeworld(c);
  renderPlanet(planetEl, planet);
}

// Aktivera sök
if (searchInput) {
  const onSearch = debounce(() => {
    currentQuery = searchInput.value.trim();
    loadPage(1);
  }, 350);
  searchInput.addEventListener("input", onSearch);
}

loadPage(1);
