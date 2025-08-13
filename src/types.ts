export interface Character {
  id?: number;              // vissa API:n ger id direkt
  name: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  // swapi.online kan ge homeworld som id eller url – stöd båda
  homeworld?: number | string;
}

export interface Planet {
  id?: number;
  name: string;
  rotation_period?: string;
  orbital_period?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  population?: string;
}

export interface PagedResult<T> {
  next?: string | null;
  previous?: string | null;
  results?: T[];
  // vissa varianter kan använda data + pagination – vi hanterar bägge
  data?: T[];
}
