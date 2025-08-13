import "./../styles.css";
import { getCharacters, getHomeworld } from "./api/swapi";
import { renderList, renderCharacter, renderPlanet, showLoader } from "./ui/render";
import type { Character } from "./types";

const listEl = document.getElementById("list")!;
const charEl = document.getElementById("character")!;
const planetEl = document.getElementById("homeworld")!;

let currentPage = 1;
//let currentList: Character[] = [];

async function loadPage(page: number) {
  currentPage = Math.max(1, page);
  showLoader(listEl);
  const { items, next, prev } = await getCharacters(currentPage);
  //currentList = items;
  renderList(listEl, items, pickCharacter, currentPage, prev, next, loadPage);

  // välj första som default
  if (items[0]) pickCharacter(items[0]);
}

async function pickCharacter(c: Character) {
  showLoader(charEl);
  showLoader(planetEl);

  renderCharacter(charEl, c);
  const planet = await getHomeworld(c);
  renderPlanet(planetEl, planet);
}

loadPage(1);
