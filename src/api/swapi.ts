import type { Character, Planet } from "../types";

const BASE = "https://swapi.online/api";

async function toJSON<T>(r: Response): Promise<T> {
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return (await r.json()) as T;
}

function unpack<T>(json: any): T[] {
  if (Array.isArray(json)) return json as T[];
  if (Array.isArray(json.results)) return json.results as T[];
  if (Array.isArray(json.data)) return json.data as T[];
  if (Array.isArray(json.items)) return json.items as T[];
  if (Array.isArray(json.characters)) return json.characters as T[];
  return [];
}

function hasNext(j: any) {
  const n = j?.next;
  return typeof n === "string" ? true : Boolean(n);
}
function hasPrev(j: any) {
  const p = j?.previous ?? j?.prev;
  return typeof p === "string" ? true : Boolean(p);
}

export async function getCharacters(page = 1): Promise<{items: Character[]; next: boolean; prev: boolean;}> {
  const urls = [
    `${BASE}/characters?page=${page}`,
    `${BASE}/people?page=${page}`,
    `${BASE}/characters`, // fallback utan page
  ];
  for (const url of urls) {
    try {
      const json = await fetch(url).then(toJSON<any>);
      const items = unpack<Character>(json);
      if (items.length) return { items, next: hasNext(json), prev: hasPrev(json) };
    } catch { /* prova nästa url */ }
  }
  return { items: [], next: false, prev: false };
}

export async function searchCharacters(q: string, page = 1): Promise<{items: Character[]; next: boolean; prev: boolean;}> {
  if (!q.trim()) return getCharacters(page);
  const urls = [
    `${BASE}/people?search=${encodeURIComponent(q)}&page=${page}`,
    `${BASE}/characters?search=${encodeURIComponent(q)}&page=${page}`,
  ];
  for (const url of urls) {
    try {
      const json = await fetch(url).then(toJSON<any>);
      const items = unpack<Character>(json);
      return { items, next: hasNext(json), prev: hasPrev(json) };
    } catch { /* prova nästa url */ }
  }
  return { items: [], next: false, prev: false };
}

export async function getPlanetById(id: number): Promise<Planet> {
  return fetch(`${BASE}/planets/${id}`).then(toJSON<Planet>);
}

export async function getHomeworld(character: Character): Promise<Planet | null> {
  const hw: any = (character as any).homeworld;
  if (!hw) return null;
  if (typeof hw === "number") return getPlanetById(hw);
  if (typeof hw === "string") {
    try { return await fetch(hw).then(toJSON<Planet>); } catch { return null; }
  }
  if (typeof hw === "object" && "id" in hw) return getPlanetById(hw.id as number);
  return null;
}
