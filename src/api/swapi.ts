import type { Character, Planet, PagedResult } from "../types";

const BASE = "https://swapi.online/api";

export async function getCharacters(page = 1): Promise<{items: Character[]; next: boolean; prev: boolean;}> {
  const res = await fetch(`${BASE}/characters?page=${page}`);
  const json = await res.json() as PagedResult<Character>;

  const items = (json.results ?? json.data ?? []) as Character[];
  const next = Boolean(json.next);
  const prev = Boolean(json.previous);
  return { items, next, prev };
}

export async function getPlanetById(id: number): Promise<Planet> {
  const res = await fetch(`${BASE}/planets/${id}`);
  return await res.json() as Planet;
}

// Hjälpfunktion: tolka homeworld (kan vara id eller url)
export async function getHomeworld(character: Character): Promise<Planet | null> {
  if (!character.homeworld) return null;
  if (typeof character.homeworld === "number") return getPlanetById(character.homeworld);
  if (typeof character.homeworld === "string") {
    // om homeworld är en url -> hämta den direkt
    const res = await fetch(character.homeworld);
    return await res.json() as Planet;
  }
  return null;
}
