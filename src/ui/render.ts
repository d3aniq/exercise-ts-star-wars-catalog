import type { Character, Planet } from "../types";

export function showLoader(el: HTMLElement) {
  el.innerHTML = `<span class="loader" aria-label="loading"></span>`;
}

export function renderList(el: HTMLElement, items: Character[], onPick: (c: Character)=>void, page: number, hasPrev: boolean, hasNext: boolean, onPage: (p:number)=>void) {
  el.innerHTML = `
    <h2>Characters</h2>
    <ul>
      ${items.map((c,i)=>`<li data-index="${i}" style="cursor:pointer">${c.name}</li>`).join("")}
    </ul>
    <div style="display:flex; gap:8px; justify-content:space-between">
      <button id="prev" ${!hasPrev ? "disabled": ""}>Prev</button>
      <span>Page ${page}</span>
      <button id="next" ${!hasNext ? "disabled": ""}>Next</button>
    </div>
  `;
  el.querySelectorAll("li").forEach(li=>{
    li.addEventListener("click", ()=>{
      const idx = Number((li as HTMLElement).dataset.index);
      onPick(items[idx]);
    });
  });
  (el.querySelector("#prev") as HTMLButtonElement)?.addEventListener("click", ()=> onPage(page-1));
  (el.querySelector("#next") as HTMLButtonElement)?.addEventListener("click", ()=> onPage(page+1));
}

export function renderCharacter(el: HTMLElement, c: Character) {
  el.innerHTML = `
    <h3>${c.name}</h3>
    <p><strong>Height:</strong> ${c.height ?? "-"}</p>
    <p><strong>Mass:</strong> ${c.mass ?? "-"}</p>
    <p><strong>Hair:</strong> ${c.hair_color ?? "-"}</p>
    <p><strong>Skin:</strong> ${c.skin_color ?? "-"}</p>
    <p><strong>Eyes:</strong> ${c.eye_color ?? "-"}</p>
    <p><strong>Birth year:</strong> ${c.birth_year ?? "-"}</p>
    <p><strong>Gender:</strong> ${c.gender ?? "-"}</p>
  `;
}

export function renderPlanet(el: HTMLElement, p: Planet | null) {
  if (!p) { el.textContent = "No homeworld data"; return; }
  el.innerHTML = `
    <h3>${p.name}</h3>
    <p><strong>Rotation (h):</strong> ${p.rotation_period ?? "-"}</p>
    <p><strong>Orbital (days):</strong> ${p.orbital_period ?? "-"}</p>
    <p><strong>Diameter:</strong> ${p.diameter ?? "-"}</p>
    <p><strong>Climate:</strong> ${p.climate ?? "-"}</p>
    <p><strong>Gravity:</strong> ${p.gravity ?? "-"}</p>
    <p><strong>Terrain:</strong> ${p.terrain ?? "-"}</p>
    <p><strong>Population:</strong> ${p.population ?? "-"}</p>
  `;
}
